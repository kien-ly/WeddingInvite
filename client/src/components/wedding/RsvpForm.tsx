import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertRsvpSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Extended schema with validation
const formSchema = insertRsvpSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RsvpForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: true,
      guests: 1,
      meal: "",
      message: "",
    },
  });

  // Mutation for submitting RSVP
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("POST", "/api/rsvps", data);
    },
    onSuccess: () => {
      toast({
        title: "RSVP Submitted",
        description: "Thank you for your RSVP. We look forward to celebrating with you!",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      console.error("RSVP error:", error);
    },
  });

  // Submit handler
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <section id="rsvp" className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://images.unsplash.com/photo-1513346940167-2b0c10737644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            RSVP
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            We would be honored to have you join us on our special day. Please let us know if you can attend by July 15, 2023.
          </p>
        </div>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto bg-neutral-50 p-8 rounded-lg shadow-md border border-primary/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Full Name</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Your Email" 
                        className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="attending"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-neutral-700 font-medium">Will you attend?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      defaultValue={field.value ? "yes" : "no"}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <label htmlFor="yes" className="cursor-pointer">Joyfully Accept</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <label htmlFor="no" className="cursor-pointer">Regretfully Decline</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Number of Guests</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 People</SelectItem>
                        <SelectItem value="3">3 People</SelectItem>
                        <SelectItem value="4">4 People</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="meal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Meal Preference</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
                          <SelectValue placeholder="Select your meal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chicken">Chicken</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-neutral-700 font-medium">Message for the Couple</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts or wishes..." 
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
                className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-md"
              >
                {isSubmitting ? "Sending..." : "Send RSVP"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
