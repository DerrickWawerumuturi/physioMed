import { User } from "../payload-typed";
import { Access } from "payload/config";

export const isAdminOrAuthor: Access<User> = ({ req: { user } }) => {
  if (user) {
    if (user.roles.includes("admin")) return true;

    if (user.roles.includes("author") && user.posts?.length > 0) {
      return {
        or: [
          {
            site: {
              in: user.sites,
            },
          },
          {
            site: {
              exists: false,
            },
          },
        ],
      };
    }
  }

  return {
    or: [
      {
        status: {
          equals: "published",
        },
      },
    ],
  };
};
