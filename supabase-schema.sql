-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Benchmark Equipment',
  date TEXT NOT NULL,
  category TEXT DEFAULT 'Equipment Guides',
  image TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can read blog posts" ON blog_posts
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Authenticated users can insert blog posts" ON blog_posts
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update blog posts" ON blog_posts
  FOR UPDATE
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts
  FOR DELETE
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
