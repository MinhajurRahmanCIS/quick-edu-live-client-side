import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Peer from 'peerjs';
import { AuthContext } from '../../../../contexts/AuthProvider';
import useLoadUser from '../../../../hooks/useLoadUser';
import { CiMicrophoneOff, CiMicrophoneOn, CiVideoOff, CiVideoOn } from 'react-icons/ci';
import { PiVideoCameraSlashDuotone } from 'react-icons/pi';

// Utility function to create a safe ResizeObserver
const createSafeResizeObserver = (callback) => {
  return new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      callback(entries);
    });
  });
};

function Room({ socket }) {
  const { user } = useContext(AuthContext);
  const { userInfo, userIsLoading } = useLoadUser(user);
  
  const { roomId } = useParams();
  const [peerId, setPeerId] = useState('');
  const [streams, setStreams] = useState({});
  const [micStates, setMicStates] = useState({});
  const [videoStates, setVideoStates] = useState({});
  const [screenShare, setScreenShare] = useState(null);
  const [enlargedStream, setEnlargedStream] = useState(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);
  const screenShareRef = useRef(null);
  const peersRef = useRef({});
  const videoContainerRef = useRef(null);


  // Use the safe ResizeObserver
  const resizeObserver = useRef(null);

  const handleResize = useCallback((entries) => {
    // Handle resize logic here if needed
    console.log('Container resized');
  }, []);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
      startLocalStream(id).then(() => {
        socket.emit('join-room', roomId, id);
      });
    });

    peer.on('call', handleIncomingCall);

    peerInstance.current = peer;

    socket.on('user-connected', (userId) => {
      console.log('New user connected:', userId);
      connectToNewUser(userId);
    });

    socket.on('user-disconnected', (userId) => {
      console.log('User disconnected:', userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
      }
      setStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
      setMicStates(prev => {
        const newMicStates = { ...prev };
        delete newMicStates[userId];
        return newMicStates;
      });
      setVideoStates(prev => {
        const newVideoStates = { ...prev };
        delete newVideoStates[userId];
        return newVideoStates;
      });
      if (screenShare && screenShare.userId === userId) {
        setScreenShare(null);
      }
    });

    socket.on('user-mute-change', ({ userId, isMuted }) => {
      setMicStates(prev => ({ ...prev, [userId]: isMuted }));
    });

    socket.on('user-video-change', ({ userId, isVideoOff }) => {
      setVideoStates(prev => ({ ...prev, [userId]: isVideoOff }));
    });

    socket.on('screen-share-started', ({ userId, stream }) => {
      setScreenShare({ userId, stream });
    });

    socket.on('screen-share-stopped', () => {
      setScreenShare(null);
    });

    if (videoContainerRef.current) {
      resizeObserver.current = createSafeResizeObserver(handleResize);
      resizeObserver.current.observe(videoContainerRef.current);
    }

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('user-mute-change');
      socket.off('user-video-change');
      socket.off('screen-share-started');
      socket.off('screen-share-stopped');
      Object.values(peersRef.current).forEach(call => call.close());
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach(track => track.stop());
      }
      peer.destroy();
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [roomId, socket, handleResize]);

  const startLocalStream = async (userId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setStreams(prev => ({ ...prev, [userId]: stream }));
      setMicStates(prev => ({ ...prev, [userId]: false }));
      setVideoStates(prev => ({ ...prev, [userId]: false }));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleIncomingCall = (call) => {
    call.answer(localStreamRef.current);
    call.on('stream', (remoteStream) => {
      setStreams(prev => ({ ...prev, [call.peer]: remoteStream }));
    });
    peersRef.current[call.peer] = call;
  };

  const connectToNewUser = (userId) => {
    const call = peerInstance.current.call(userId, localStreamRef.current);
    call.on('stream', (remoteStream) => {
      setStreams(prev => ({ ...prev, [userId]: remoteStream }));
    });
    peersRef.current[userId] = call;
  };

  const toggleMic = (userId) => {
    if (userId === peerId) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicStates(prev => {
        const newState = { ...prev, [userId]: !audioTrack.enabled };
        socket.emit('mute-change', { roomId, isMuted: !audioTrack.enabled });
        return newState;
      });
    }
  };

  const toggleVideo = (userId) => {
    if (userId === peerId) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoStates(prev => {
        const newState = { ...prev, [userId]: !videoTrack.enabled };
        socket.emit('video-change', { roomId, isVideoOff: !videoTrack.enabled });
        return newState;
      });
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenShareRef.current = stream;
      setScreenShare({ userId: peerId, stream });
      socket.emit('screen-share-started', { roomId, userId: peerId });

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      Object.values(peersRef.current).forEach((call) => {
        if (call && call.peerConnection) {
          const sender = call.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0])
              .catch(error => console.error("Error replacing track:", error));
          }
        }
      });
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const stopScreenShare = () => {
    if (screenShareRef.current) {
      screenShareRef.current.getTracks().forEach(track => track.stop());
      screenShareRef.current = null;
    }
    setScreenShare(null);
    socket.emit('screen-share-stopped', { roomId });

    Object.values(peersRef.current).forEach((call) => {
      if (call && call.peerConnection) {
        const sender = call.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender && localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            sender.replaceTrack(videoTrack).catch(error => console.error("Error replacing track:", error));
          }
        }
      }
    });
  };



  const toggleEnlargedStream = (userId) => {
    if (enlargedStream === userId) {
      setEnlargedStream(null);
    } else {
      setEnlargedStream(userId);
    }
  };

  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const defaultTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", defaultTheme);
  }, [theme]);

  if(userIsLoading) {
    return <>....</>
  }

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-4">Room: {roomId}</h1>
      <h2 className="text-xl mb-2">Your peer ID: {peerId}</h2> */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={screenShare ? stopScreenShare : startScreenShare}
          className={`btn  ${screenShare ? 'bg-red-500' : 'btn-accent'
            } text-white`}
        >
          {screenShare ? 'Stop Screen Share' : 'Start Screen Share'}
        </button>

        <Link to={`/myhome/classinfo/${roomId}`} className="btn btn-outline btn-error">End Class</Link>
      </div>

      <div ref={videoContainerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenShare && (
          <div
            className="col-span-full aspect-w-16 aspect-h-9 mb-4 cursor-pointer"
            onClick={() => toggleEnlargedStream(screenShare.userId)}
          >
            <video
              ref={el => {
                if (el) {
                  el.srcObject = screenShare.stream;
                  el.play().catch(error => console.error("Error playing screen share:", error));
                }
              }}
              className="w-full h-full object-contain"
              autoPlay
              playsInline
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <span>{screenShare.userId === peerId ? 'Your Screen' : `User ${screenShare.userId.slice(0, 5)}'s Screen`}</span>
            </div>
          </div>
        )}
        {Object.entries(streams).map(([userId, stream]) => (
          <div
            key={userId}
            className={`relative aspect-w-16 aspect-h-9 cursor-pointer ${enlargedStream === userId ? 'col-span-3' : ''
              }`}
            onClick={() => toggleEnlargedStream(userId)}
          >
            <video
              ref={el => {
                if (el) {
                  el.srcObject = stream;
                  el.play().catch(error => console.error("Error playing video:", error));
                }
              }}
              className="w-full h-full object-cover"
              muted={userId === peerId}
              autoPlay
              playsInline
            />
            {videoStates[userId] && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <span className="text-white text-4xl"><PiVideoCameraSlashDuotone /> </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
              <span>{userId === peerId ? `${userInfo?.data?.name?.slice(0, 5)} (Me)` : `${userInfo?.data?.name?.slice(0, 5)}`}</span>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMic(userId);
                  }}
                  className={`text-2xl btn ${micStates[userId] ? 'btn-error' : 'btn-success'
                    }`}
                  disabled={userId !== peerId}
                >
                  {micStates[userId] ? <CiMicrophoneOn /> : <CiMicrophoneOff />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideo(userId);
                  }}
                  className={`ms-2 text-2xl btn ${videoStates[userId] ? 'btn-error' : 'btn-success'
                    }`}
                  disabled={userId !== peerId}
                >
                  {videoStates[userId] ? <CiVideoOn /> : <CiVideoOff />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Room;