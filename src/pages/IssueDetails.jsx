import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import issueService from '../appwrite/issue';
import storageService from '../appwrite/storage';
import { setLoading } from '../redux/uiSlice';

const IssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchIssueAndComments = async () => {
        try {
            dispatch(setLoading(true));
            const issueData = await issueService.getIssueById(id);
            setIssue(issueData);

            const commentsData = await issueService.getComments(id);
            setComments(commentsData.documents);
        } catch (error) {
            toast.error("Failed to load issue details");
            navigate('/issues');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (id) {
            fetchIssueAndComments();
        }
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            await issueService.addComment({
                issueId: id,
                userId: user.$id,
                comment: newComment.trim()
            });
            setNewComment("");
            // Refresh comments
            const commentsData = await issueService.getComments(id);
            setComments(commentsData.documents);
            toast.success("Comment added");
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (!issue) return null;

    return (
        <div className="w-full space-y-10">
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <h1 className='text-4xl font-black tracking-tight'>Issue Details</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Issue Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white leading-tight">{issue.title}</h2>
                            <div className="ml-4 flex-shrink-0">
                                {getStatusBadge(issue.status)}
                            </div>
                        </div>
                        {issue.imageId && (
                            <img
                                src={storageService.getFilePreview(issue.imageId)}
                                alt={issue.title}
                                className="w-full h-48 object-cover rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 mb-6"
                            />
                        )}
                        <p className="text-neutral-600 dark:text-neutral-300 text-base whitespace-pre-wrap mb-6">{issue.desc}</p>
                        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700/50 text-sm font-bold text-neutral-400 dark:text-neutral-500 flex flex-col gap-2">
                            <span>Reported by: <span className="text-indigo-600 dark:text-indigo-400">{issue.userId === user?.$id ? (user?.name || 'You') : `User (${issue.userId.substring(0, 4)})`}</span></span>
                            <span>Date: {new Date(issue.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="lg:col-span-2 space-y-6 ">
                    <div className="rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm p-8 flex flex-col h-[calc(80vh-12rem)] min-h-[360px]">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">Communication</h3>

                        <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
                            {comments.length === 0 ? (
                                <div className="text-center py-10 text-neutral-400 font-medium">
                                    No comments yet. Start the conversation below.
                                </div>
                            ) : (
                                comments.map((c) => {
                                    const isMe = c.userId === user.$id;
                                    return (
                                        <div key={c.$id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-xs font-bold text-neutral-500">{isMe ? 'You' : (user.labels?.includes('admin') && c.userId !== user.$id ? 'User' : 'Admin')}</span>
                                                <span className="text-[10px] font-bold text-neutral-400">{new Date(c.$createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`px-5 py-3 rounded-2xl max-w-[85%] ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm' : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 rounded-tl-sm shadow-sm'}`}>
                                                <p className="whitespace-pre-wrap text-sm">{c.comment}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleAddComment} className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700/50 flex gap-3">
                            <input
                                type="text"
                                className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium"
                                placeholder="Type a message..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
