"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  if (isLoadingUser && !user) {
    return (
      <div 
        className="w-full max-w-2xl p-8 rounded-[18px] animate-pulse relative overflow-hidden"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full" style={{ backgroundColor: "var(--skeleton-base)" }} />
          <div className="space-y-3 flex-1">
            <div className="h-6 rounded w-1/3" style={{ backgroundColor: "var(--skeleton-base)" }} />
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--skeleton-base)" }} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--skeleton-base)" }} />
            <div className="h-11 rounded w-full" style={{ backgroundColor: "var(--skeleton-base)" }} />
          </div>
          <div className="space-y-2">
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--skeleton-base)" }} />
            <div className="h-11 rounded w-full" style={{ backgroundColor: "var(--skeleton-base)" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full p-0 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        borderRadius: "var(--card-radius)",
      }}
    >
      {/* Decorative Glow */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-50"
        style={{ background: "var(--gradient-hero-glow)" }}
      />
      <div 
        aria-hidden 
        className="pointer-events-none absolute top-0 left-0 w-full h-[1px]"
        style={{ background: "var(--gradient-border-sheen)" }}
      />

      {/* Header section with Avatar */}
      <div className="px-8 pt-10 pb-8 border-b relative z-10 flex flex-col items-center text-center" style={{ borderColor: "var(--table-row-border)" }}>
        <div className="relative group mb-5">
            <div 
              className="absolute inset-0 rounded-full blur-md opacity-40 transition-opacity duration-300 group-hover:opacity-70"
              style={{ background: "var(--gradient-primary-button)" }}
            />
            <Avatar className="h-20 w-20 ring-4 ring-offset-2 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ "--tw-ring-color": "var(--card-bg)", "--tw-ring-offset-color": "transparent" } as React.CSSProperties}>
              <AvatarImage src="" alt={user?.name || "User"} />
              <AvatarFallback 
                className="text-2xl font-bold text-white shadow-inner"
                style={{ backgroundImage: "var(--gradient-primary-button)" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            {user?.role && (
              <div 
                className="absolute -bottom-2 -right-2 z-20 p-1.5 rounded-full"
                style={{ 
                  background: "var(--card-bg)",
                  boxShadow: "var(--elevation-1)" 
                }}
              >
                <div 
                  className="p-1 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundImage: "var(--gradient-metric-accent)" }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 mt-2">
            <h2 className="text-[24px] font-bold font-geist leading-tight tracking-tight mb-1.5" style={{ color: "var(--text-primary)" }}>
              {user?.name || "Personal Information"}
            </h2>
            <p className="text-[14px] flex items-center justify-center gap-1.5 font-medium" style={{ color: "var(--text-secondary)" }}>
              <Mail className="h-4 w-4 opacity-70" />
              {user?.email}
            </p>
          </div>
      </div>
      
      {/* Form Section */}
      <div className="p-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <label htmlFor="name" className="text-[13px] font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <User className="h-4 w-4 opacity-70" />
              Full Name
            </label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isUpdating}
              className="h-11 px-4 text-[14px] font-medium transition-all duration-200 outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
                boxShadow: "var(--input-shadow)",
                borderRadius: "var(--input-radius)",
              }}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2.5">
            <label htmlFor="email" className="text-[13px] font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Mail className="h-4 w-4 opacity-70" />
              Email Address
            </label>
            <div className="relative">
              <Input 
                id="email"
                value={user?.email || ""}
                disabled
                className="h-11 px-4 text-[14px] font-medium cursor-not-allowed opacity-60"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                  color: "var(--text-secondary)",
                  borderRadius: "var(--input-radius)",
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--surface-glass)" }}>
                  Verified
                </span>
              </div>
            </div>
            <p className="text-[12px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Email address is used for authentication and cannot be changed here.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t flex justify-end" style={{ borderColor: "var(--table-row-border)" }}>
            <Button 
              type="submit" 
              className="h-10 px-6 rounded-[10px] text-[13.5px] font-semibold text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundImage: "var(--gradient-primary-button)",
                boxShadow: "var(--glow-primary-cta)",
                opacity: (isUpdating || name === user?.name || !name.trim()) ? 0.6 : 1,
                cursor: (isUpdating || name === user?.name || !name.trim()) ? "not-allowed" : "pointer"
              }}
              disabled={isUpdating || name === user?.name || !name.trim()}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
