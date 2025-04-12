import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { insertRsvpSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { WEDDING_INFO } from "@/lib/utils";
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
  email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RsvpPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        title: "Xác Nhận Thành Công",
        description: "Cảm ơn bạn đã xác nhận tham dự. Chúng tôi rất vui được đón tiếp bạn!",
      });
      form.reset();
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể gửi xác nhận. Vui lòng thử lại.",
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="font-['Playfair_Display'] text-3xl text-primary mb-4">Cảm Ơn Bạn!</h1>
          <p className="text-neutral-700 mb-6">
            Xác nhận tham dự của bạn đã được ghi nhận. Chúng tôi rất vui mừng được chào đón bạn trong ngày đặc biệt này.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/80 text-white">
              Quay Lại Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="text-primary hover:underline block mb-6">
              ← Quay Lại Trang Chủ
            </Link>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
              Xác Nhận Tham Dự
            </h1>
            <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-neutral-700">
              Chúng tôi rất mong được chào đón bạn trong ngày trọng đại này. Vui lòng xác nhận tham dự trước ngày 15 tháng 7, 2023.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-primary/20">
            <div className="mb-8 text-center">
              <h2 className="font-['Dancing_Script'] text-2xl text-primary mb-2">
                {WEDDING_INFO.couple.fullNames}
              </h2>
              <p className="text-neutral-700">
                {WEDDING_INFO.event.date} - {WEDDING_INFO.event.venue}
              </p>
            </div>
            
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700 font-medium">Họ và Tên</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên của bạn" 
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
                        <FormLabel className="text-neutral-700 font-medium">Địa Chỉ Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email của bạn" 
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
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Bạn sẽ tham dự chứ?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "yes")}
                          defaultValue={field.value ? "yes" : "no"}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes" />
                            <label htmlFor="yes" className="cursor-pointer">Tôi sẽ tham dự</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <label htmlFor="no" className="cursor-pointer">Rất tiếc, tôi không thể tham dự</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700 font-medium">Số Lượng Khách</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
                              <SelectValue placeholder="Chọn số lượng khách" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 Người</SelectItem>
                            <SelectItem value="2">2 Người</SelectItem>
                            <SelectItem value="3">3 Người</SelectItem>
                            <SelectItem value="4">4 Người</SelectItem>
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
                        <FormLabel className="text-neutral-700 font-medium">Lựa Chọn Món Ăn</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
                              <SelectValue placeholder="Chọn món ăn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chicken">Gà</SelectItem>
                            <SelectItem value="fish">Cá</SelectItem>
                            <SelectItem value="vegetarian">Món Chay</SelectItem>
                            <SelectItem value="vegan">Món Thuần Chay</SelectItem>
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
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Lời Nhắn Cho Cặp Đôi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Chia sẻ lời chúc mừng của bạn..." 
                          className="rounded-md border-primary/20 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-center pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/80 text-white font-medium py-3 px-10 rounded-md"
                  >
                    {isSubmitting ? "Đang Gửi..." : "Gửi Xác Nhận"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}