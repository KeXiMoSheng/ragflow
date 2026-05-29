import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSetModalState } from '@/hooks/common-hooks';
import { Docagg } from '@/interfaces/database/chat';
import PdfDrawer from '@/pages/next-search/document-preview-modal';
import { middleEllipsis } from '@/utils/common-util';
import { downloadDocument } from '@/utils/file-util';
import { Download } from 'lucide-react';
import { useCallback, useState } from 'react';
import FileIcon from '../file-icon';

export function ReferenceDocumentList({ list }: { list: Docagg[] }) {
  const { visible, showModal, hideModal } = useSetModalState();
  const [selectedDocument, setSelectedDocument] = useState<Docagg>();

  const handleDownload = useCallback(
    (item: Docagg) => async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await downloadDocument({ id: item.doc_id, filename: item.doc_name });
      } catch (error) {
        console.error('Error downloading document:', error);
      }
    },
    [],
  );

  return (
    <section className="flex gap-3 flex-wrap">
      {list.map((item) => (
        <Card key={item.doc_id}>
          <CardContent
            className="flex items-center p-2 space-x-2 cursor-pointer"
            onClick={() => {
              setSelectedDocument(item);
              showModal();
            }}
          >
            <FileIcon id={item.doc_id} name={item.doc_name}></FileIcon>
            {/* <NewDocumentLink
              documentId={item.doc_id}
              documentName={item.doc_name}
              prefix="document"
              link={item.url}
              className="text-text-sub-title-invert"
            >
              {middleEllipsis(item.doc_name)}
            </NewDocumentLink> */}
            <div className="text-text-sub-title-invert flex-1">
              {middleEllipsis(item.doc_name)}
            </div>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={handleDownload(item)}
            >
              <Download className="size-[1em]" />
            </Button>
          </CardContent>
        </Card>
      ))}
      {visible && selectedDocument && (
        <PdfDrawer
          visible={visible}
          hideModal={hideModal}
          documentId={selectedDocument.doc_id}
          chunk={{
            document_name: selectedDocument.doc_name,
          }}
        ></PdfDrawer>
      )}
    </section>
  );
}
