"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import ProfileUpload from "@/components/ProfileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { userDetails } from "@/types";
import { FaTimes } from "react-icons/fa";

interface editDetail {
  userId: string;
  setEditPopUp: Dispatch<SetStateAction<boolean>>;
}

const EditClientDetails = ({ userId, setEditPopUp }: editDetail) => {
  const [updateProfileDetails, setUpdateProfileDetails] = useState({
    locationText: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    linkedinLink: "",
  });
  const editProfileImage = true;
  const { toast } = useToast();
  const [userDetails, setUserDetails] = useState<userDetails>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", userId);
        if (error) {
          throw error;
        }
        if (data) {
          setUserDetails(data[0]);
          setUpdateProfileDetails({
            locationText: userDetails?.location ?? "",
            facebookLink: userDetails?.facebook ?? "",
            instagramLink: userDetails?.instagram ?? "",
            twitterLink: userDetails?.twitter ?? "",
            linkedinLink: userDetails?.linkedIn ?? "",
          });
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchUserDetails();
  }, [
    userDetails?.facebook,
    userDetails?.instagram,
    userDetails?.linkedIn,
    userDetails?.location,
    userDetails?.twitter,
    userId,
  ]);

  const handleUpdate = async () => {
    const {
      locationText,
      twitterLink,
      linkedinLink,
      instagramLink,
      facebookLink,
    } = updateProfileDetails;
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        loaction: locationText,
        twitter: twitterLink,
        linkedIn: linkedinLink,
        facebook: facebookLink,
        instagram: instagramLink,
      });
      if (error) {
        throw error;
      } else {
        toast({
          description: "Update Successful",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };
  return (
    <>
      <section className="absolute top-0 w-full min-h-[100vh] z-[100] right-0 left-0 bg-stone-700">
        <div className="flex fleex-col items-center justify-center">
          <div className="bg-white w-[300px] mt-4 relative sm:w-[500px] md:w-[600px] my-4 h-[100%] mx-auto sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
            <FaTimes
              onClick={() => setEditPopUp(false)}
              className="absolute top-4 right-4 cursor-pointer"
            />

            <ProfileUpload userId={userId} edit={editProfileImage} />

            <Input
              value={updateProfileDetails.locationText}
              className="text-base my-3 border-t-none outline-none"
              placeholder="Enter location"
              onChange={(e) => {
                setUpdateProfileDetails({
                  ...updateProfileDetails,
                  locationText: e.target.value,
                });
              }}
            />
            <div className="text-base">
              Link to social media accounts
              <Input
                value={updateProfileDetails.instagramLink}
                className="text-base my-3 border-t-none outline-none"
                placeholder="Instagram"
                onChange={(e) => {
                  setUpdateProfileDetails({
                    ...updateProfileDetails,
                    instagramLink: e.target.value,
                  });
                }}
              />
              <Input
                value={updateProfileDetails.twitterLink}
                className="text-base my-3 border-t-none outline-none"
                placeholder="Twitter"
                onChange={(e) => {
                  setUpdateProfileDetails({
                    ...updateProfileDetails,
                    twitterLink: e.target.value,
                  });
                }}
              />
              <Input
                value={updateProfileDetails.linkedinLink}
                className="text-base my-3 border-t-none outline-none"
                placeholder="LinkedIn"
                onChange={(e) => {
                  setUpdateProfileDetails({
                    ...updateProfileDetails,
                    linkedinLink: e.target.value,
                  });
                }}
              />
              <Input
                value={updateProfileDetails.facebookLink}
                className="my-3 border-t-none text-base outline-none"
                placeholder="Facebook"
                onChange={(e) => {
                  setUpdateProfileDetails({
                    ...updateProfileDetails,
                    facebookLink: e.target.value,
                  });
                }}
              />
            </div>
            <Button
              type="button"
              className="bg-[#6272B9] text-base mt-4 text-white py-1 px-6 rounded-md text-center"
              onClick={handleUpdate}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditClientDetails;
