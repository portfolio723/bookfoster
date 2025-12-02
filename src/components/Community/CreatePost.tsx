'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { createCommunityPost } from '@/lib/services/communityService';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  category: z.string(),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

const categories = ['General', 'Book Recommendations', 'Reading Tips', 'Event Updates', 'Help Needed'];

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'General',
      content: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      form.setError('root', { message: 'You must be logged in to create a post.' });
      return;
    }

    const result = await createCommunityPost(user.id, values.title, values.content, values.category);

    if (result.success) {
      toast({
        title: 'Post Created!',
        description: 'Your post has been successfully created.',
      });
      router.push('/community');
    } else {
      form.setError('root', { message: result.error || 'An unexpected error occurred.' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-12">
        <CardHeader>
            <CardTitle className="text-3xl font-headline">Create a New Post</CardTitle>
            <CardDescription>Share your thoughts with the community.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {form.formState.errors.root && (
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                        </Alert>
                    )}

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a descriptive title" {...field} />
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
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
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
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your post content here..."
                                        rows={8}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Creating Post...' : 'Create Post'}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
