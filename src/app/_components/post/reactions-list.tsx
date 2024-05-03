"use client"
import { Reaction } from "@prisma/client";
import React, { useMemo } from "react";

type Props = {
  postId: string;
  reactions:Reaction[]
};



const ReactionsList = ({ postId,reactions }: Props) => {
    const thumbsUp = useMemo(()=>{
        return reactions.filter((item)=>item.type === "THUMBS-UP")
    },[reactions]);
    const happyReactions = useMemo(()=>{
        return reactions.filter((item)=>item.type === "HAPPY")
    },[reactions]);
    const fireReactions = useMemo(()=>{
        return reactions.filter((item)=>item.type === "FIRE")
    },[reactions]);
    const heartReactions = useMemo(()=>{
        return reactions.filter((item)=>item.type === "HEART")
    },[reactions]);
    const funnyReactions = useMemo(()=>{
        return reactions.filter((item)=>item.type === "FUNNY")
    },[reactions]);

    console.log(thumbsUp,heartReactions)
  return <div></div>;
};

export default ReactionsList;
