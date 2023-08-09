import ProfileUpload from "./ProfileUpload";

interface clientProfile {
  userId: string;
  userName: string;
  userPhone: string;
}

const ClientDetails = ({ userId, userName, userPhone }: clientProfile) => {
  return (
    <section>
      <div className="bg-white my-4 h-[100%] md:max-h-[500px] md:min-w-[300px] rounded-xl p-4 sm:p-8">
        <ProfileUpload userId={userId} />
        <div className="my-3">
          <p>{userName}</p>
          <p>{userPhone}</p>
        </div>
      </div>
    </section>
  );
};

export default ClientDetails;
