import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../../Layout/HomeLayout";
import Home from "../../Pages/Home/Home/Home";
import Signup from "../../Pages/Signup/Signup";
import Login from "../../Pages/Login/Login";
import MyHome from "../../Pages/MyHome/MyHome/MyHome";
import Main from "../../Layout/Main";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Profile from "../../Pages/Profile/Profile";
import ClassLayout from "../../Layout/ClassLayout";
import ClassPeople from "../../Pages/ClassInfo/ClassPeople/ClassPeople";
import ClassInfo from "../../Pages/ClassInfo/ClassInfo/ClassInfo/ClassInfo";
import Quizzes from "../../Pages/ClassInfo/Works/Quizzes/Quizzes/Quizzes";
import Assignments from "../../Pages/ClassInfo/Works/Assignments/Assignments/Assignments";
import ViewQuiz from "../../Pages/ClassInfo/Works/Quizzes/ViewQuiz/ViewQuiz/ViewQuiz";
import ViewAssignment from "../../Pages/ClassInfo/Works/Assignments/ViewAssignment/ViewAssignment";
import PaperChecker from "../../Pages/PaperChecker/PaperChecker/PaperChecker";
import PaperSummery from "../../Pages/PaperChecker/PaperSummery/PaperSummery";
import AllPaper from "../../Pages/PaperChecker/AllPaper/AllPaper";
import TeacherRoute from "../TeacherRoute/TeacherRoute";
import PremiumRoute from "../PremiumRoute/PremiumRoute";
import Checkout from "../../Pages/Payment/Checkout/Checkout";
import Payment from "../../Pages/Payment/Payment/Payment";
import StartQuiz from "../../Pages/ClassInfo/StartQuiz/StartQuiz";
import QuizResult from "../../Pages/ClassInfo/QuizResult/QuizResult";
import ViewQuizSubmission from "../../Pages/ClassInfo/Works/Quizzes/ViewQuizSubmission/ViewQuizSubmission";
import ViewAssignmentSubmission from "../../Pages/ClassInfo/Works/Assignments/ViewAssignmentSubmission/ViewAssignmentSubmission";
import Help from "../../Pages/Help/Help";
import FeedBack from "../../Pages/Logs/FeedBack/FeedBack";
import ReportAProblem from "../../Pages/Logs/ReportAProblem/ReportAProblem";
import WhatsNew from "../../Pages/Logs/WhatsNew/WhatsNew";
import Fail from "../../Pages/Payment/Payment/Fail";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import EditProfile from "../../Pages/Profile/EditProfile";
import Presentation from "../../Pages/Presentation/Presentation/Presentation";
import MyPresentation from "../../Pages/Presentation/MyPresentation/MyPresentation";
import { io } from "socket.io-client";
import QHome from "../../Pages/MyHome/QuickClass/QuickMeet/QHome";
import Room from "../../Pages/MyHome/QuickClass/QuickMeet/Room";
import Module from "../../Pages/Module/Module/Module";
import MyModule from "../../Pages/Module/MyModule/MyModule";
import StartModule from "../../Pages/Module/StartModule/StartModule";
import Certificate from "../../Pages/Module/StartModule/Certificate";

const socket = io('https://meet-p57l.onrender.com');

const router = createBrowserRouter([
    //Home Directory
    {
        path: '/',
        element: <HomeLayout></HomeLayout>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/signup',
                element: <Signup></Signup>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
        ]
    },
    {
        path: "/myhome",
        element: <PrivateRoute><Main></Main></PrivateRoute>,
        children: [
            {
                path: "/myhome",
                element: <PrivateRoute><MyHome></MyHome></PrivateRoute>
            },
            {
                path: "/myhome/profile",
                element: <PrivateRoute><Profile></Profile></PrivateRoute>
            },
            {
                path: "/myhome/editprofile",
                element: <PrivateRoute><EditProfile></EditProfile></PrivateRoute>
            },
            {
                path: "/myhome/viewquizzes/:id",
                element: <PrivateRoute><ViewQuiz></ViewQuiz></PrivateRoute>
            },
            {
                path: "/myhome/paperchecker",
                element: <TeacherRoute><PremiumRoute><PaperChecker></PaperChecker></PremiumRoute></TeacherRoute>
            },
            {
                path: "/myhome/allpaper",
                element: <TeacherRoute><PremiumRoute><AllPaper></AllPaper></PremiumRoute></TeacherRoute>
            },
            {
                path: "/myhome/papersummery/:id",
                element: <TeacherRoute><PremiumRoute><PaperSummery></PaperSummery></PremiumRoute></TeacherRoute>
            },
            {
                path: "/myhome/help",
                element: <PrivateRoute><Help></Help></PrivateRoute>
            },
            {
                path: "/myhome/feedback",
                element: <PrivateRoute><FeedBack></FeedBack></PrivateRoute>
            },
            {
                path: "/myhome/report",
                element: <PrivateRoute><ReportAProblem></ReportAProblem></PrivateRoute>
            },
            {
                path: "/myhome/whatsnew",
                element: <PrivateRoute><WhatsNew></WhatsNew></PrivateRoute>
            },
            {
                path: "/myhome/checkout",
                element: <TeacherRoute><Checkout></Checkout></TeacherRoute>
            },
            {
                path: "/myhome/payment/success/:email/:transactionId",
                element: <TeacherRoute><Payment></Payment></TeacherRoute>
            },
            {
                path: "/myhome/payment/fail",
                element: <TeacherRoute><Fail></Fail></TeacherRoute>
            },
            {
                path: "/myhome/presentation",
                element: <PrivateRoute><Presentation></Presentation></PrivateRoute>
            },
            {
                path: "/myhome/mypresentation",
                element: <PrivateRoute><MyPresentation></MyPresentation></PrivateRoute>
            },
            {
                path: "/myhome/module",
                element: <PrivateRoute><Module></Module></PrivateRoute>
            },
            {
                path: "/myhome/mymodule",
                element: <PrivateRoute><MyModule></MyModule></PrivateRoute>
            },
            {
                path: "/myhome/startmodule/:id",
                element: <PrivateRoute><StartModule></StartModule></PrivateRoute>
            },
            {
                path: "/myhome/certificate/:id",
                element: <PrivateRoute><Certificate></Certificate></PrivateRoute>
            },
            {
                path: "/myhome/classinfo",
                element: <PrivateRoute><ClassLayout></ClassLayout></PrivateRoute>,
                children: [
                    {
                        path: "/myhome/classinfo/:id",
                        element: <PrivateRoute><ClassInfo></ClassInfo></PrivateRoute>
                    },
                    {
                        path: "/myhome/classinfo/quizzes/:id",
                        element: <PrivateRoute><Quizzes></Quizzes></PrivateRoute>
                    },
                    {
                        path: "/myhome/classinfo/assignments/:id",
                        element: <PrivateRoute><Assignments></Assignments></PrivateRoute>
                    },
                    {
                        path: "/myhome/classinfo/classpeople/:id",
                        element: <PrivateRoute><ClassPeople></ClassPeople></PrivateRoute>
                    },
                ]
            },
        ]
    },
    {
        path: '/start/:examId',
        element: <PrivateRoute><StartQuiz></StartQuiz></PrivateRoute>
    },
    {
        path: '/result/:id/:userEmail',
        element: <PrivateRoute><QuizResult></QuizResult></PrivateRoute>
    },
    {
        path: "/viewassignment/:id/:hasSubmitted",
        element: <PrivateRoute><ViewAssignment></ViewAssignment></PrivateRoute>
    },
    {
        path: "/viewquizsubmission/:id",
        element: <PrivateRoute><ViewQuizSubmission></ViewQuizSubmission></PrivateRoute>
    },
    {
        path: "/viewassignmentsubmission/:id",
        element: <PrivateRoute><ViewAssignmentSubmission></ViewAssignmentSubmission></PrivateRoute>
    },
    {
        path: "/qhome/:id",
        element: <QHome />
    },
    {
        path: "/room/:roomId",
        element: <Room socket={socket} />
    },


])

export default router;