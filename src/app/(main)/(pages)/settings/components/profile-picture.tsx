import React from 'react'
import UploadCareButton from './uploadcare-button'
import { useRouter } from 'next/navigation'

type Props = {
    userImage: string | null
    onDelete?: () => Promise<any>
    onUpload?: () => void
}

const ProfilePicture: React.FC<Props> = ({ userImage, onDelete, onUpload }) => {
    const router = useRouter()
    
    const onRemoveProfileImage = async () => {
        if (onDelete) {
            const response = await onDelete()
            if (response) {
                router.refresh()
            }
        }
    }

    return (
        <div className="flex flex-col">
            <p className="text-lg text-white">Profile Picture</p>
            <div className="flex h-[30vh] flex-col items-center justify-center">
                {userImage ? (
                    <img src={userImage} alt="Profile" className="h-full w-auto" />
                ) : (
                    <UploadCareButton onUpload={onUpload} />
                )}
                {userImage && (
                    <button onClick={onRemoveProfileImage} className="mt-2 bg-red-500 text-white py-1 px-3 rounded">
                        Remove Image
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProfilePicture
