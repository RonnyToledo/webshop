"use client";
import { MoreVertical, Star } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "@formkit/tempo";

export function ReviewCard({ name, created_at, star, cmt }) {
  return (
    <div className="py-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={"/placeholder.svg"} alt={name} />
          </Avatar>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((ind) => (
                  <Star
                    key={ind}
                    className={`w-4 h-4 ${
                      ind <= star
                        ? "fill-blue-400 text-blue-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                {format(created_at, "short")}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <p className="mt-2 text-gray-500">{cmt || "..."}</p>
    </div>
  );
}
