import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import authService from '../appwrite/auth';
import storageService from '../appwrite/storage';
import { setUser } from '../redux/authSlice';
import { setLoading } from '../redux/uiSlice';
import toast from 'react-hot-toast';
import conf from '../config/config'
import { dashboardRoutes } from '../config/routes'

export default function Settings() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const darkMode = useSelector((state) => state.theme.darkMode);
    
    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        dispatch(setLoading(true));
        
        try {
            // Upload to Appwrite storage
            const uploadedFile = await storageService.uploadFile(file);
            
            // Get the URL
            const fileUrl = storageService.getFilePreview(uploadedFile.$id).href;

            // Merge with existing preferences
            const newPrefs = { ...(user.prefs || {}), avatar: fileUrl, avatarId: uploadedFile.$id };
            
            // Update User Preferences
            const updatedUser = await authService.updatePrefs(newPrefs);
            
            // Update local state
            dispatch(setUser(updatedUser));
            toast.success("Profile image updated successfully!");

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
            dispatch(setLoading(false));
            e.target.value = null; // reset input
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            

            <div>
                <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-700">
                    <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar display */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 dark:border-indigo-900/30 shadow-lg shadow-indigo-500/20 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                {user?.prefs?.avatarId ? (
                                    <img src={`https://fra.cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketID}/files/${user.prefs.avatarId}/view?project=${conf.appwriteProjectId}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-indigo-400">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            
                            <label className="absolute bottom-0 right-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer shadow-lg transition-transform active:scale-95 group-hover:scale-110">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                </svg>
                            </label>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{user?.name}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-2">{user?.email}</p>
                            
                            {user?.labels?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {user.labels.map((label) => (
                                        <span key={label} className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="text-sm text-neutral-500 max-w-sm">
                                Click the camera icon to upload a new profile picture. Max size: 5MB.
                            </p>
                        </div>
                    </div>
                </div>
                 <div className="p-5">
                    <h2 className="text-xl font-bold mb-6">Application Preferences</h2>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 flex items-center justify-center">
                                {darkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold">Dark Mode</h4>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Toggle dark/light theme</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={darkMode} 
                                onChange={() => dispatch(toggleTheme())}
                            />
                            <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
                <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-700">
                    <h2 className="text-xl font-bold mb-6">Features & Access</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dashboardRoutes
                            .filter(r => r.name && !r.path.includes(':'))
                            .map((feature) => {
                                const isUnlocked = !feature.requiredLabel || user?.labels?.includes(feature.requiredLabel);
                                const icons = { 'Dashboard': '📊', 'Accounts': '💳', 'Categories': '🏷️', 'Transactions': '📝', 'Investments': '🏦', 'Loans': '💰', 'Settings': '⚙️' };
                                return (
                                    <div key={feature.path} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isUnlocked ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-700' : 'bg-neutral-100/50 dark:bg-neutral-900/30 border-dashed border-neutral-200 dark:border-neutral-800 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{icons[feature.name] || '📍'}</span>
                                            <div>
                                                <p className="font-bold text-sm">{feature.name}</p>
                                                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-400 mt-0.5">
                                                    {feature.requiredLabel ? `${feature.requiredLabel} Access` : 'Core Feature'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${isUnlocked ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                                            {isUnlocked ? '✓ Unlocked' : '✕ Locked'}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

               
            </div>
        </div>
    );
}
