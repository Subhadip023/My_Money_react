import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import Button from '../shared/Button';
import issueService from '../../appwrite/issue';
import storageService from '../../appwrite/storage';
import { setLoading } from '../../redux/uiSlice';

const IssueModal = ({ isOpen, onClose, onIssueSaved }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.ui.loading);
    const [previewImage, setPreviewImage] = useState(null);

    // Reset when modal closes/opens
    React.useEffect(() => {
        if (!isOpen) {
            reset();
            setPreviewImage(null);
        }
    }, [isOpen, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const onSubmit = async (data) => {
        if (loading) return;
        dispatch(setLoading(true));
        
        try {
            let imageId = null;
            if (data.image && data.image[0]) {
                const file = await storageService.uploadFile(data.image[0]);
                if (file && file.$id) {
                    imageId = file.$id;
                }
            }

            const issueData = {
                title: data.title,
                desc: data.desc,
                imageId: imageId,
                status: 1, // Default status: Issued
                userId: user.$id,
                type: data.type
            };

            await issueService.createIssue(issueData);
            toast.success("Issue submitted successfully!");
            onIssueSaved();
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to submit issue");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Report an Issue">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">Issue Title</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium ${errors.title ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'}`}
                            placeholder="Short summary"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.title.message}</span>}
                    </div>
                    <div className="w-full md:w-40">
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">Type</label>
                        <select
                            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium cursor-pointer"
                            {...register("type")}
                            defaultValue="issue"
                        >
                            <option value="bug">Bug</option>
                            <option value="feature">Feature</option>
                            <option value="issue">Issue</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">Description</label>
                    <textarea
                        rows="4"
                        className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium resize-none ${errors.desc ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'}`}
                        placeholder="Full details of the problem"
                        {...register("desc", { required: "Description is required" })}
                    ></textarea>
                    {errors.desc && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.desc.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">Attachment (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-neutral-500 dark:text-neutral-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-xl file:border-0
                            file:text-sm file:font-black
                            file:bg-indigo-50 file:text-indigo-600
                            hover:file:bg-indigo-100
                            dark:file:bg-indigo-500/10 dark:file:text-indigo-400
                            transition-all cursor-pointer"
                        {...register("image")}
                        onChange={handleImageChange}
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Preview" className="mt-4 rounded-xl h-32 w-full object-cover shadow-sm border border-neutral-200 dark:border-neutral-700" />
                    )}
                </div>

                <div className="pt-4 flex gap-4">
                    <Button onClick={onClose} variant="secondary" className="flex-1">Cancel</Button>
                    <Button type="submit" loading={loading} className="flex-1 text-center justify-center">
                        Submit Issue
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default IssueModal;
