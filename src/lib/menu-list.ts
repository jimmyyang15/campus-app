import { User } from "lucia";
import {
    Tag,
    Users,
    Settings,
    Bookmark,
    CircleUser 
  } from "lucide-react";
  import { FaRegUser } from "react-icons/fa6";
  import { MdOutlineGroups2,MdOutlineHome,MdOutlineInsertInvitation  } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
  
  type Submenu = {
    href: string;
    label: string;
    active: boolean;
  };
  
  type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: any;
    role:string;
  };
  
  type Group = {
    menus: Menu[];
  };
  
  export function getMenuList(pathname: string): Group[] {
    return [
      {
        menus: [
          {
            href: "/",
            label: "Home",
            active: pathname === "/",
            icon:  MdOutlineHome,
            role:""
          }
        ]
      },
      {
        menus: [
          {
            href: "/clubs",
            label: "Clubs",
            active: pathname.includes("/clubs"),
            icon: MdOutlineGroups2,
            role:""
       
          },
          
          {
            href: "/certificate",
            label: "E Certificate",
            active: pathname === "/certificate",
            icon:  TbCertificate,
            role:"student"
          },
          {
            href: "/invitations",
            label: "Invitations",
            active: pathname.includes("/invitations"),
            icon: MdOutlineInsertInvitation,
            role:"student"
          },
   
        ]
      },
      {
        menus: [
          // {
          //   href: "/profile",
          //   label: "Profile",
          //   active: pathname.includes("/profile"),
          //   icon: FaRegUser ,
          //   role:""
          // },
          {
            href: "/account/profile",
            label: "Account",
            active: pathname.includes("/account"),
            icon: CircleUser,
            role:""
          }
        ]
      }
    ];
  }