
import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { ArrowUpOnSquareIcon } from '../Icons';

interface ProfileTabProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ currentUser, onUserUpdate }) => {
    const [name, setName] = useState(currentUser.name);
    const [bio, setBio] = useState(currentUser.bio || '');
    const [avatar, setAvatar] = useState(currentUser.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // In a real app, you would upload this file to a server/storage
            // and get back a URL. For this simulation, we use a blob URL.
            setAvatar(URL.createObjectURL(file));
        }
    };
    
    const handleSaveChanges = () => {
        const updatedUser = { ...currentUser, name, bio, avatarUrl: avatar };
        onUserUpdate(updatedUser);
        alert("Profile updated successfully!"); // Simulate toast notification
    };

    const hasChanges = name !== currentUser.name || bio !== (currentUser.bio || '') || avatar !== currentUser.avatarUrl;

    return (
        <div className="max-w-3xl">
            <h1 className="text-xl font-bold mb-1">Profile</h1>
            <p className="text-pm-text-secondary mb-6">This is how others will see you on the site.</p>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <div className="p-6 space-y-6">
                     <div className="flex items-center space-x-4">
                        <img src={avatar} alt={name} className="w-20 h-20 rounded-full" />
                        <div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 text-sm rounded-md border border-pm-border hover:bg-pm-border"
                            >
                                Change Avatar
                            </button>
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                            <p className="text-xs text-pm-text-secondary mt-2">JPG, GIF or PNG. 2MB max.</p>
                        </div>
                    </div>

                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-pm-text-secondary mb-1">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-pm-text-secondary mb-1">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            maxLength={160}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-pm-text-secondary mt-1">{160 - bio.length} characters remaining.</p>
                    </div>

                </div>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end">
                    <button 
                        onClick={handleSaveChanges}
                        disabled={!hasChanges}
                        className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold disabled:bg-pm-blue/50 disabled:cursor-not-allowed"
                    >
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProfileTab;