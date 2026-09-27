"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const { user, updateUserName, isLoadingUser } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [prevUserName, setPrevUserName] = useState(user?.name);
  const [isUpdating, setIsUpdating] = useState(false);

  if (user?.name !== prevUserName) {
    setPrevUserName(user?.name);
    setName(user?.name || "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;

    setIsUpdating(true);
    try {
      await updateUserName(name);
    } catch (error) {
      // Toast is already handled in the store
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoadingUser && !user) {
    return (
      <div className="glass-panel p-8 max-w-2xl animate-pulse">
        <div className="h-8 bg-surface-overlay rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-surface-overlay rounded w-1/2 mb-8"></div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-surface-overlay rounded w-1/4"></div>
            <div className="h-10 bg-surface-overlay rounded w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-surface-overlay rounded w-1/4"></div>
            <div className="h-10 bg-surface-overlay rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 max-w-2xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-heading-lg font-geist font-semibold mb-2 text-primary">Personal Information</h2>
      <p className="text-muted mb-8 font-body text-body-md">Update your account details and preferences.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label htmlFor="name" className="text-label font-medium text-foreground">
            Full Name
          </label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUpdating}
            className="font-body bg-surface text-foreground border-border focus-visible:ring-primary shadow-sm"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-label font-medium text-foreground">
            Email Address
          </label>
          <Input 
            id="email"
            value={user?.email || ""}
            disabled
            className="font-body bg-surface/30 text-muted border-border cursor-not-allowed opacity-70"
          />
          <p className="text-body-sm text-muted">Email address cannot be changed.</p>
        </div>

        <div className="pt-6 flex justify-end">
          <Button 
            type="submit" 
            className="btn-primary px-8" 
            disabled={isUpdating || name === user?.name || !name.trim()}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
