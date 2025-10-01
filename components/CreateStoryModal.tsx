'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const storySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['Family', 'Friend', 'Place', 'Kings', 'Kingdoms']),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type StoryFormData = z.infer<typeof storySchema>;

interface CreateStoryModalProps {
  onStoryCreated?: () => void;
}

export default function CreateStoryModal({ onStoryCreated }: CreateStoryModalProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ type: string; url: string; publicId: string }[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Family',
      isPremium: false,
      tags: [],
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setMediaFiles(prev => [...prev, {
            type: file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'audio',
            url: data.url,
            publicId: data.publicId
          }]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setUploading(false);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: StoryFormData) => {
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          media: mediaFiles,
        }),
      });

      if (response.ok) {
        form.reset();
        setMediaFiles([]);
        setOpen(false);
        onStoryCreated?.();
        setSuccessOpen(true);
      } else if (response.status === 403) {
        const body = await response.json().catch(() => ({} as any));
        toast.info(body?.error || 'Please buy a subscription to create more stories');
        router.push(body?.redirect || '/pricing');
      } else if (response.status === 401) {
        toast.error('Please sign in first');
        router.push('/auth/signin');
      } else {
        const body = await response.json().catch(() => ({} as any));
        toast.error(body?.error || 'Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Something went wrong creating your story');
    }
  };

  return (
    <>
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r  from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create New stories</span>
          </motion.button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-screen-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle> 
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give your story a meaningful title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Place">Place</SelectItem>
                      <SelectItem value="Kings">Kings</SelectItem>
                      <SelectItem value="Kingdoms">Kingdoms</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your heartfelt story..." 
                      className="min-h-[140px] sm:min-h-[160px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Media Files</FormLabel>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Click to upload photos, videos, or audio'}
                    </p>
                  </div>
                </label>
              </div>

              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative group">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {media.type === 'image' && (
                        <img
                          src={media.url}
                          alt=""
                          className="w-full h-28 sm:h-24 object-cover rounded"
                        />
                      )}
                      {media.type === 'video' && (
                        <video
                          src={media.url}
                          className="w-full h-28 sm:h-24 object-cover rounded"
                        />
                      )}
                      {media.type === 'audio' && (
                        <div className="w-full h-28 sm:h-24 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-sm">Audio File</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Share Story'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

    {/* Success Modal */}
    <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Story Created Successfully</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-gray-600">
          Your story has been published.
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSuccessOpen(false)}>Close</Button>
          <Button onClick={() => { setSuccessOpen(false); router.push('/stories'); }}>Go to Stories</Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}