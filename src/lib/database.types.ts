export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          handle: string;
          headline: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          handle: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          handle?: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      media: {
        Row: {
          id: string;
          profile_id: string;
          type: "IMAGE" | "VIDEO";
          url: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: "IMAGE" | "VIDEO";
          url: string;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          type?: "IMAGE" | "VIDEO";
          url?: string;
          title?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      links: {
        Row: {
          id: string;
          profile_id: string;
          label: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          label: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          label?: string;
          url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      socials: {
        Row: {
          id: string;
          profile_id: string;
          platform: "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "GITHUB" | "YOUTUBE" | "FACEBOOK" | "TIKTOK" | "OTHER";
          handle: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          platform: "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "GITHUB" | "YOUTUBE" | "FACEBOOK" | "TIKTOK" | "OTHER";
          handle: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          platform?: "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "GITHUB" | "YOUTUBE" | "FACEBOOK" | "TIKTOK" | "OTHER";
          handle?: string;
          url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "socials_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
