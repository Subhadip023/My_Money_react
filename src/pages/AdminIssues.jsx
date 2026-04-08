import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import issueService from '../appwrite/issue';
import storageService from '../appwrite/storage';
import { setLoading } from '../redux/uiSlice';

const AdminIssues = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [issues, setIssues] = useState([]);

    const fetchIssues = async () => {
        try {
            dispatch(setLoading(true));
            const response = await issueService.getAllIssues();
            setIssues(response.documents);
        } catch (error) {
            toast.error("Failed to load all issues");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const updateStatus = async (issueId, currentStatus, newStatus) => {
        if(currentStatus === Number(newStatus)) return;
        
        try {
            dispatch(setLoading(true));
            await issueService.updateIssue(issueId, { status: Number(newStatus) });
            
            const statusMap = {
                1: 'In Progress',
                2: 'Solved',
                3: 'Cancelled'
            };
            
            if (user?.$id) {
                await issueService.addComment({
                    issueId: issueId,
                    userId: user.$id,
                    comment: `System: Issue status was changed to *${statusMap[newStatus]}*`
                });
            }
            
            toast.success("Status updated successfully");
            fetchIssues();
        } catch(error) {
            toast.error("Failed to update status");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getStatusBadge = (status) => {
        switch (Number(status)) {
            case 1:
                return <span className="px-3 py-1 bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-full text-xs font-bold">In Progress</span>;
            case 2:
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-bold">Solved</span>;
            case 3:
                return <span className="px-3 py-1 bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-full text-xs font-bold">Cancelled</span>;
            default:
                return <span className="px-3 py-1 bg-neutral-100 text-neutral-600 dark:bg-neutral-500/10 dark:text-neutral-400 rounded-full text-xs font-bold">Unknown</span>;
        }
    };

    return (
        <div className="w-full space-y-10">
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>All User Issues</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage and update the status of issues reported by all users.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {issues.length === 0 ? (
                    <div className="rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No issues reported</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm font-medium">
                            No users have reported any issues yet.
                        </p>
                    </div>
                ) : (
                    issues.map((issue) => (
                        <div key={issue.$id} className="rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm p-6 flex flex-col sm:flex-row gap-6 transition-all hover:bg-white/80 dark:hover:bg-neutral-800/50 group">
                            {issue.imageId && (
                                <div className="sm:w-48 flex-shrink-0">
                                    <img 
                                        src={storageService.getFilePreview(issue.imageId)} 
                                        alt={issue.title} 
                                        className="w-full h-32 sm:h-full object-cover rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700/50"
                                    />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">{issue.title}</h3>
                                    <div className="ml-4 flex-shrink-0 flex items-center gap-3">
                                        <select 
                                            className="px-3 py-1 m-0 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm font-bold cursor-pointer"
                                            value={issue.status}
                                            onChange={(e) => updateStatus(issue.$id, issue.status, e.target.value)}
                                        >
                                            <option value="1">In Progress</option>
                                            <option value="2">Solved</option>
                                            <option value="3">Cancelled</option>
                                        </select>
                                        {getStatusBadge(issue.status)}
                                    </div>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-300 text-base whitespace-pre-wrap flex-1">{issue.desc}</p>
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700/50 text-sm font-bold flex justify-between items-center w-full">
                                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                        <span className="text-neutral-400 dark:text-neutral-500">Reported on {new Date(issue.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">By: {issue.userId === user?.$id ? (user?.name || 'You') : `User (${issue.userId.substring(0,4)})`}</span>
                                    </div>
                                    <Link to={`/issues/${issue.$id}`} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors font-bold flex items-center gap-2">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminIssues;
