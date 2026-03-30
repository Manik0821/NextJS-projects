'use client'
import React, { useState } from 'react'
import './page.css'

/**
 * TYPE DEFINITIONS
 */
type PollOption = {
    id: number;
    label: string;
    value: number;
    color: string;
}

/**
 * INITIAL DATA
 * Static config outside the component to prevent re-initialization
 */
const initialPolls: PollOption[] = [
    { id: 1, label: 'Option 1', value: 0, color: '#4CAF50' },
    { id: 2, label: 'Option 2', value: 0, color: '#2196F3' },
    { id: 3, label: 'Option 3', value: 0, color: '#FF9800' },
    { id: 4, label: 'Option 4', value: 0, color: '#F44336' },
];

const Poll = () => {
    // State management for poll data
    const [polls, setPolls] = useState<PollOption[]>(initialPolls)
    
    // Calculate total votes for percentage logic
    const totalVotes = polls.reduce((total, poll) => total + poll.value, 0);

    /**
     * HANDLER: Handles voting by ID
     * Uses functional update to avoid direct state mutation
     */
    const onVote = (id: number) => {
        setPolls(prevPolls => 
            prevPolls.map(poll => 
                poll.id === id ? { ...poll, value: poll.value + 1 } : poll
            )
        );
    }

    return (
        <div className='poll-wrapper'>
            <div className="poll-container">
                
                {/* VERTICAL RESULTS AREA */}
                <div className="poll-results">
                    {polls.map((poll) => {
                        // Calculate percentage safely
                        const percentage = totalVotes === 0 
                            ? 0 
                            : ((poll.value / totalVotes) * 100).toFixed(2);

                        return (
                            <div key={poll.id} className="poll-column">
                                {/* Percentage Text at Top */}
                                <span className='poll-percentage'>{percentage}%</span>
                                
                                {/* The Bar Track */}
                                <div className="poll-track">
                                    <div 
                                        className="poll-bar" 
                                        style={{ 
                                            height: `${percentage}%`, 
                                            background: `${poll.color}` 
                                        }}
                                    >
                                        {/* Optional: Show vote count inside bar if it has height */}
                                        {poll.value > 0 && <span className="vote-count">{poll.value}</span>}
                                    </div>
                                </div>

                                {/* Label at Bottom */}
                                <span className='poll-label'>{poll.label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* VOTE BUTTONS AREA */}
                <div className="poll-controls">
                    <p className="total-text">Total Votes: {totalVotes}</p>
                    <div className="button-group">
                        {polls.map((poll) => (
                            <button 
                                key={poll.id}
                                className="vote-button" 
                                style={{ borderLeft: `4px solid ${poll.color}` }}
                                onClick={() => onVote(poll.id)}
                            >
                                Vote {poll.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Poll;
