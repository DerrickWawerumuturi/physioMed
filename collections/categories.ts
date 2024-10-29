import { isLoggedIn } from "../access/isLoggedIn";
import { CollectionConfig } from "payload/types";
import { yourOwnCommentsOrCategory } from "../access/isOwnComments";

export const Categories: CollectionConfig = {
  slug: "category",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: yourOwnCommentsOrCategory,
    delete: yourOwnCommentsOrCategory,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
