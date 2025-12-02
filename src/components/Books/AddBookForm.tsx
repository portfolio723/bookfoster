'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { addBook, uploadBookCover } from '@/lib/services/bookService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Upload } from 'lucide-react';

export default function AddBookForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Fiction',
    condition: 'good',
    language: 'English',
    pages: '',
    published_year: '',
    description: '',
    book_type: 'rent' as 'rent' | 'buy' | 'donate',
    price_per_day: '',
    price_buy: '',
    stock_quantity: '1',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');

  const categories = [
    'Fiction', 'Non-Fiction', 'Educational', 'Children', 
    'Mystery', 'Romance', 'Science', 'History', 'Biography'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add a book.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let cover_image_url = '';

      // Upload cover if selected
      if (coverFile) {
        const uploadResult = await uploadBookCover(coverFile, user.id);
        if (uploadResult.success && uploadResult.url) {
          cover_image_url = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || 'Failed to upload cover image.');
        }
      }

      // Add book
      const result = await addBook(user.id, {
        ...formData,
        cover_image_url,
        price_per_day: formData.price_per_day ? parseFloat(formData.price_per_day) : undefined,
        price_buy: formData.price_buy ? parseFloat(formData.price_buy) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        published_year: formData.published_year ? parseInt(formData.published_year) : undefined,
        stock_quantity: parseInt(formData.stock_quantity),
      });

      if (result.success) {
        setSuccess('Book added successfully! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-12">
        <CardHeader>
            <CardTitle className="text-3xl font-headline">Add a New Book</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="cover-image">Book Cover</Label>
                    <Input id="cover-image" type="file" accept="image/*" onChange={handleCoverSelect} />
                    {coverPreview && (
                        <div className="mt-4">
                            <Image src={coverPreview} alt="Cover Preview" width={128} height={192} className="object-cover rounded-md border" />
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input id="author" name="author" value={formData.author} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select name="condition" value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                            <SelectTrigger id="condition">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                {conditions.map((cond) => (
                                    <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                 <div className="space-y-2">
                    <Label>Type *</Label>
                    <RadioGroup
                        value={formData.book_type}
                        onValueChange={(value) => handleSelectChange('book_type', value as 'rent' | 'buy' | 'donate')}
                        className="flex items-center gap-6 pt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rent" id="rent" />
                            <Label htmlFor="rent">For Rent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buy" id="buy" />
                            <Label htmlFor="buy">For Sale</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="donate" id="donate" />
                            <Label htmlFor="donate">For Donation</Label>
                        </div>
                    </RadioGroup>
                </div>


                {formData.book_type === 'rent' && (
                    <div className="space-y-2">
                        <Label htmlFor="price_per_day">Price Per Day (₹)</Label>
                        <Input id="price_per_day" name="price_per_day" type="number" step="0.01" value={formData.price_per_day} onChange={handleInputChange} />
                    </div>
                )}
                {formData.book_type === 'buy' && (
                    <div className="space-y-2">
                        <Label htmlFor="price_buy">Sale Price (₹) *</Label>
                        <Input id="price_buy" name="price_buy" type="number" step="0.01" value={formData.price_buy} onChange={handleInputChange} required />
                    </div>
                )}

                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="A brief summary of the book, its edition, etc." />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" name="language" value={formData.language} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pages">Pages</Label>
                        <Input id="pages" name="pages" type="number" value={formData.pages} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="published_year">Published Year</Label>
                        <Input id="published_year" name="published_year" type="number" value={formData.published_year} onChange={handleInputChange} />
                    </div>
                    {formData.book_type !== 'donate' && (
                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input id="stock_quantity" name="stock_quantity" type="number" min="1" value={formData.stock_quantity} onChange={handleInputChange} />
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                    {loading ? 'Adding Book...' : 'Submit Book'}
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
