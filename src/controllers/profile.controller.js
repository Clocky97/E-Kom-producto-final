import Profile from "../models/profile.model.js";

export const getProfileByUserId = async (userId) => {
    try {
        const profileData = await Profile.findOne({ where: { user_id: userId } });
        return profileData;
    } catch (error) {
        throw new Error("Error fetching profile: " + error.message);
    }
}

export const createProfile = async (profileData) => {
    try {
        const newProfile = await profile.create(profileData);
        return newProfile;
    } catch (error) {
        throw new Error("Error creating profile: " + error.message);
    }
}

export const updateProfile = async (userId, profileData) => {
    try {
        const existingProfile = await profile.findOne({ where: { user_id: userId } });
        if (!existingProfile) {
            throw new Error("Profile not found");
        }
        await existingProfile.update(profileData);
        return existingProfile;
    } catch (error) {
        throw new Error("Error updating profile: " + error.message);
    }
}

export const deleteProfile = async (userId) => {    
    try {
        const existingProfile = await profile.findOne({ where: { user_id: userId } });
        if (!existingProfile) {
            throw new Error("Profile not found");
        }
        await existingProfile.destroy();
        return { message: "Profile deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting profile: " + error.message);
    }
}

export const getAllProfiles = async () => {
    try {
        const profiles = await profile.findAll();
        return profiles;
    } catch (error) {
        throw new Error("Error fetching profiles: " + error.message);
    }
}