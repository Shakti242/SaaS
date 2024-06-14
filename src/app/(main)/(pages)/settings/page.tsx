import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './components/profile-picture'

type Props = {
  user?: {
    profileImage?: string
    // other user fields
  }
}

const Settings: React.FC<Props> = (props) => {
  const removeProfileImage = async (): Promise<any> => {
    // Implement the function logic here
    console.log('Remove profile image')
    return true // Assuming the image removal is successful
  }

  const uploadProfileImage = (): void => {
    // Implement the function logic here
    console.log('Upload profile image')
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="stick top-0 z-[-10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50 mb-8">
            Add or update your information
          </p>
          <div>
            <ProfilePicture 
              onDelete={removeProfileImage}
              userImage={props.user?.profileImage || ''}
              onUpload={uploadProfileImage}
            />
          </div>
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}

export default Settings
