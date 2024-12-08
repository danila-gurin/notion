'use client';
import * as Y from 'yjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FormEvent, useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotIcon, LanguagesIcon } from 'lucide-react';
import { toast } from 'sonner';
import Markdown from 'react-markdown';

type Language =
  | 'english'
  | 'spanish'
  | 'portuguese'
  | 'french'
  | 'german'
  | 'chinese'
  | 'arabic'
  | 'hindi'
  | 'russian'
  | 'japanese';

const languages: Language[] = [
  'english',
  'spanish',
  'portuguese',
  'french',
  'german',
  'chinese',
  'arabic',
  'hindi',
  'russian',
  'japanese',
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [isPending, startTransition] = useTransition();
  const cleanSummary = summary
    .replace(/<\/?[^>]+>/g, '') // Remove all XML/HTML tags
    .replace(/\.([А-Яа-яA-Za-z])/g, '. $1') // Add space after periods followed by a letter
    .trim(); // Remove any leading/trailing whitespace
  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get('document-store').toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success('translated summary successfully!');
      }
    });
  };
  console.log(summary);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline">
          <DialogTrigger>
            <LanguagesIcon />
            Translate
          </DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Translate the document</DialogTitle>
            <DialogDescription>
              Select a language and AI will translate a summary of the document
              in the selected language.
            </DialogDescription>
            <hr className="mt-5" />
            {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
          </DialogHeader>
          {summary && (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  GPT {isPending ? 'Is thinking...' : 'Says:'}
                </p>
              </div>
              <p>
                {isPending ? (
                  'Thinking...'
                ) : (
                  <Markdown>{cleanSummary}</Markdown>
                )}
              </p>
            </div>
          )}
          <form className="flex gap-2" onSubmit={handleAskQuestion}>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={!language || isPending}>
              {isPending ? 'Translating...' : 'Translate'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default TranslateDocument;