
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TestimonialCardProps {
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    image?: string;
  };
}

const TestimonialCard = ({ content, author }: TestimonialCardProps) => {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full hover-card-effect">
      <CardContent className="p-6">
        <div className="mb-4">
          <svg
            className="h-6 w-6 text-purple-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 italic">{content}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{author.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {author.role}, {author.company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
