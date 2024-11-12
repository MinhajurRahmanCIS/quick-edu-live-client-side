import React from 'react';

const ChaptersProgress = ({chapters, chapterNumber}) => {
    return (
            <div className="overflow-x-auto">
                <ul className="steps gap-4 items-center">
                    {
                        chapters?.map((chapter, i) =>
                            <>
                                <button
                                    key={i}
                                    className={
                                        `step ${chapter.chapterEndAt
                                            ?
                                            "step-neutral"
                                            :
                                            ""}  
                                        cursor-pointer
                                        `
                                    }>
                                </button>
                            </>
                        )
                    }
                </ul>
            </div>
    );
};

export default ChaptersProgress;