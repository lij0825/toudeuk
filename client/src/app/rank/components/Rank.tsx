"use client"
import React, { useState } from 'react';
import { RankInfo } from '@/types/rankInfo';
import { useSwipeable } from 'react-swipeable';

const userData: RankInfo[] = [
    { rank: 1, username: 'UserOne', clicks: 150 },
    { rank: 2, username: 'UserTwo', clicks: 120 },
    { rank: 3, username: 'UserThree', clicks: 100 },
    { rank: 4, username: 'UserFour', clicks: 80 },
    { rank: 5, username: 'UserFive', clicks: 60 },
    { rank: 6, username: 'UserSix', clicks: 60 },
    { rank: 7, username: 'UserSeven', clicks: 60 },
    { rank: 8, username: 'UserEight', clicks: 60 },
    { rank: 9, username: 'UserNine', clicks: 60 },
    { rank: 10, username: 'UserTen', clicks: 60 },
];

const additionalUserData: RankInfo[] = [
    { rank: 11, username: 'UserEleven', clicks: 50 },
    { rank: 12, username: 'UserTwelve', clicks: 40 },
    { rank: 13, username: 'UserThirteen', clicks: 30 },
    { rank: 14, username: 'UserFourteen', clicks: 20 },
    { rank: 15, username: 'UserFifteen', clicks: 10 },
];

export default function Rank() {
    const [currentRankIndex, setCurrentRankIndex] = useState(0);
    const ranks = [userData, additionalUserData];

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            setCurrentRankIndex((prevIndex) => (prevIndex + 1) % ranks.length);
        },
        onSwipedRight: () => {
            setCurrentRankIndex((prevIndex) => (prevIndex - 1 + ranks.length) % ranks.length);
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
            <h1 className="text-3xl font-bold mb-6">현재 랭킹</h1>
            <div {...handlers} className="bg-white rounded-lg shadow-md w-full max-w-2xl">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Rank</th>
                            <th className="py-2 px-4 border-b text-left">Username</th>
                            <th className="py-2 px-4 border-b text-left">Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranks[currentRankIndex].map((user) => (
                            <tr key={user.rank} className="hover:bg-gray-100">
                                <td className="py-4 px-4 border-b border-t">{user.rank}</td>
                                <td className="py-4 px-4 border-b border-t">{user.username}</td>
                                <td className="py-4 px-4 border-b border-t">{user.clicks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
