import {type UserRole, useUser} from "../hook/useUser.tsx";
import {Button} from "../components/Button.tsx";

const ProfilePage = () => {
    const [user] = useUser();
    const policy = getPolicyByRole(user.role);

    return (
        <div>
            <Button disabled={!policy.canInvite} name="Invite"
                    onClick={(e) => alert(e.currentTarget.name)}>Invite</Button>
            <Button disabled={!policy.canView}>View</Button>
        </div>
    );
}

function getPolicyByRole(role: UserRole) {
    const policy = POLICY_SET[role];

    return {
        canInvite: policy.includes("invite"),
        canView: policy.includes("view")
    };
}

const POLICY_SET = {
    admin: ["invite", "view"],
    viewer: ["view"]
};

export default ProfilePage;