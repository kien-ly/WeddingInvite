import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertWishSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { type Wish } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Extended schema with validation
const formSchema = insertWishSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function WishesSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleWishesCount, setVisibleWishesCount] = useState(3);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  // Query for fetching wishes
  const { data: wishes, isLoading } = useQuery<Wish[]>({
    queryKey: ["/api/wishes"],
  });

  // Mutation for submitting wishes
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("POST", "/api/wishes", data);
    },
    onSuccess: () => {
      toast({
        title: "Wish Submitted",
        description: "Thank you for your lovely wishes!",
      });
      form.reset();
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/wishes"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit wish. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      console.error("Wish error:", error);
    },
  });

  // Submit handler
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  // Load more wishes
  const loadMoreWishes = () => {
    setVisibleWishesCount((prev) => 
      Math.min(prev + 3, wishes?.length || 0)
    );
  };

  // Get visible wishes
  const visibleWishes = wishes?.slice(0, visibleWishesCount) || [];
  const hasMoreWishes = wishes && visibleWishesCount < wishes.length;

  return (
    <section id="wishes" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            Wishes & Guestbook
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Share your wishes and blessings for our journey together.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-6 rounded-lg shadow-md mb-10 border border-primary/20"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-neutral-700 font-medium">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Name" 
                        className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-neutral-700 font-medium">Your Wish</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your wishes for the couple..." 
                        className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded-md"
                >
                  {isSubmitting ? "Sending..." : "Send Wishes"}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="space-y-6">
            <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 text-center mb-4">
              Recent Wishes
            </h3>
            
            {isLoading ? (
              <p className="text-center py-4">Loading wishes...</p>
            ) : visibleWishes.length > 0 ? (
              <div className="space-y-6">
                {visibleWishes.map((wish) => (
                  <div key={wish.id} className="bg-white p-6 rounded-lg shadow-md border border-primary/20">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        <span>{wish.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-neutral-800">{wish.name}</p>
                        <p className="text-xs text-neutral-600">{formatDate(wish.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-neutral-700">{wish.message}</p>
                  </div>
                ))}
                
                {hasMoreWishes && (
                  <div className="text-center mt-8">
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                      onClick={loadMoreWishes}
                    >
                      Load More Wishes <span className="ml-1">↓</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-8 text-neutral-500">
                No wishes yet. Be the first to leave your wishes!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
