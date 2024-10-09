"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            if (response.data.success) {
                toast({
                    title: response.data.message,
                    variant: "default",
                });
                onMessageDelete(message._id);
            } else {
                toast({
                    title: "Error deleting message",
                    description: response.data.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            toast({
                title: "Error deleting message",
                description: "An error occurred while trying to delete the message.",
                variant: "destructive"
            });
        }
    };
    

    return (
        <Card className="relative bg-slate-800 text-white border border-slate-700 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-xl duration-300">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors"
                        aria-label="Delete message"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this message.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardHeader className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg font-semibold">
                        {message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                        Received on: {new Date(message.createdAt).toLocaleString()}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <p className="text-sm text-gray-300">
                    {message.content}
                </p>
            </CardContent>
        </Card>
    );
};

export default MessageCard;