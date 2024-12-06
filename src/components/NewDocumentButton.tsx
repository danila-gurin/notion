'use client';
import { Button } from './ui/button';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNewDocument } from '../../actions/actions';

const NewDocumentButton = () => {
  const router = useRouter(); // Use useRouter hook
  const [isPending, startTransition] = useTransition();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      // create new doc
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`); // Correct navigation
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? 'Creating...' : 'New Document'}
    </Button>
  );
};

export default NewDocumentButton;
