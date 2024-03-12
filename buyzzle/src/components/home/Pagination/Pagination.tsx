import { IconButton } from "@material-tailwind/react";
import React from 'react';

interface PaginationProps {
    postPer: number;
    totalPosts: number;
}

const Pagination: React.FC<PaginationProps> = ({ postPer, totalPosts }) => {
    const pagesNum: number[] = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postPer); i++) {
        pagesNum.push(i);
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">

                <ul>
                    <IconButton>
                        {pagesNum.map((number) => (
                            <li key={number}>
                                <a href="!#">{number}</a>
                            </li>
                        ))}
                    </IconButton>
                </ul>
            </div>
        </div>
    );
};

export default Pagination;
