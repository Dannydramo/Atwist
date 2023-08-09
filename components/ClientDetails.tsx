import { useState } from "react";
import EditClientDetails from "./EditClientDetails";
import ProfileUpload from "./ProfileUpload";
import { Button } from "./ui/button";

interface clientProfile {
  userId: string;
  userName: string;
  userPhone: string;
}

const ClientDetails = ({ userId, userName, userPhone }: clientProfile) => {
  const [editPopUp, setEditPopUp] = useState(false);
  return (
    <section>
      {editPopUp && (
        <EditClientDetails
          userId={userId}
          editPopUp={editPopUp}
          setEditPopUp={setEditPopUp}
        />
      )}

      <div className="bg-white my-4 h-[100%] md:max-h-[500px] md:min-w-[300px] rounded-xl p-4 sm:p-8">
        <ProfileUpload userId={userId} />
        <div className="my-3">
          <p>{userName}</p>
          <p>{userPhone}</p>
        </div>
        <Button
          onClick={() => setEditPopUp(true)}
          className="border text-base border-[#6272B9] bg-transparent text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
        >
          Edit Profile
        </Button>
      </div>
    </section>
  );
};

export default ClientDetails;
