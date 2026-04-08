import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import issueService from '../appwrite/issue';
import storageService from '../appwrite/storage';
import { setLoading } from '../redux/uiSlice';
import IssueModal from '../components/ui/IssueModal';
import Button from '../components/shared/Button';

const Issues = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [issues, setIssues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchIssues = async () => {
        try {
            dispatch(setLoading(true));
            if (user?.$id) {
                const response = await issueService.getIssues(user.$id);
                setIssues(response.documents);
            }
        } catch (error) {
            toast.error("Failed to load issues");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchIssues();

        const handleGlobalIssueSave = () => {
            fetchIssues();
        };

        window.addEventListener('issue_saved_globally', handleGlobalIssueSave);

        return () => {
            window.removeEventListener('issue_saved_globally', handleGlobalIssueSave);
        };
    }, [user?.$id]);

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
                    <h1 className='text-4xl font-black tracking-tight'>Support Issues</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Report new problems and track the status of your existing issues.
                    </p>
                </div>
                <div className='flex flex-col gap-2 items-end justify-center'>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className='text-lg'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Report an Issue
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {issues.length === 0 ? (
                    <div className="rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No issues reported</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm font-medium">
                            You haven't reported any issues yet. If you encounter any problems, please let us know using the form.
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
                                    <div className="ml-4 flex-shrink-0">
                                        {getStatusBadge(issue.status)}
                                    </div>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-300 text-base whitespace-pre-wrap flex-1">{issue.desc}</p>
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700/50 text-sm font-bold text-neutral-400 dark:text-neutral-500 flex justify-between items-center w-full">
                                    <span>Reported on {new Date(issue.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <Link to={`/issues/${issue.$id}`} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors font-bold flex items-center gap-2">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <IssueModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onIssueSaved={() => fetchIssues()} 
            />
        </div>
    );
};

export default Issues;
