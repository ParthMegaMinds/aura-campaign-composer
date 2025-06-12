
-- Enable the auth schema and create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ICPs table
CREATE TABLE public.icps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  persona TEXT[] NOT NULL DEFAULT '{}',
  business_size TEXT NOT NULL,
  tone TEXT NOT NULL,
  designations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content items table
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('social', 'email', 'blog', 'landing', 'proposal')),
  icp_id UUID REFERENCES public.icps(id) ON DELETE CASCADE NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create graphics table
CREATE TABLE public.graphics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  format TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar items table
CREATE TABLE public.calendar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  graphic_id UUID REFERENCES public.graphics(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'ready', 'scheduled', 'live')) DEFAULT 'draft',
  assignee TEXT,
  social_media_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icp_id UUID REFERENCES public.icps(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contents UUID[] DEFAULT '{}',
  graphics UUID[] DEFAULT '{}',
  calendar_items UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graphics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for ICPs
CREATE POLICY "Users can view their own ICPs" ON public.icps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create ICPs" ON public.icps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ICPs" ON public.icps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ICPs" ON public.icps
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for content items
CREATE POLICY "Users can view their own content" ON public.content_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create content" ON public.content_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" ON public.content_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" ON public.content_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for graphics
CREATE POLICY "Users can view their own graphics" ON public.graphics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create graphics" ON public.graphics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own graphics" ON public.graphics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own graphics" ON public.graphics
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for calendar items
CREATE POLICY "Users can view their own calendar items" ON public.calendar_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create calendar items" ON public.calendar_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar items" ON public.calendar_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar items" ON public.calendar_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_icps_user_id ON public.icps(user_id);
CREATE INDEX idx_content_items_user_id ON public.content_items(user_id);
CREATE INDEX idx_content_items_icp_id ON public.content_items(icp_id);
CREATE INDEX idx_graphics_user_id ON public.graphics(user_id);
CREATE INDEX idx_calendar_items_user_id ON public.calendar_items(user_id);
CREATE INDEX idx_calendar_items_date ON public.calendar_items(date);
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
