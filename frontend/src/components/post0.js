import {
  Box,
  Input,
  Button,
  Text,
  Image,
  CircularProgress,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import useMutation from '../hooks/useMutation';
import useQuery from '../hooks/useQuery';

const validFileTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'application/pdf',
];
const URL = '/images';

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const Posts = () => {
  const toast = useToast();
  const [refetch, setRefetch] = useState(0);
  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError,
  } = useMutation({ url: URL });

  const {
    data: imageUrls,
    isLoading: imagesLoading,
    error: fetchError,
  } = useQuery(URL, refetch);

  const [error, setError] = useState('');

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!validFileTypes.find(type => type === file.type)) {
      setError('Incorrect File Format');
      return;
    }

    const form = new FormData();
    form.append('image', file);
    await uploadImage(form);
    setTimeout(() => setRefetch(s => s + 1), 1000);
  };

  // const handleDelete = async url => {
  //   // Assuming you have a delete API method implemented
  //   await useMutation({ url, method: 'DELETE' });
  //   setRefetch(s => s + 1); // Refetch the images to update the list
  //   toast({
  //     title: 'Image Deleted.',
  //     description: 'The image has been successfully deleted.',
  //     status: 'success',
  //     duration: 9000,
  //     isClosable: true,
  //   });
  // };

  const handleShare = async url => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'Image URL has been copied to your clipboard.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    });
  };

  return (
    <Box mt={6} align="center">
      <Input
        id="imageInput"
        aligh="left"
        type="file"
        hidden
        onChange={handleUpload}
      />
      <Button
        as="label"
        htmlFor="imageInput"
        colorScheme="blue"
        variant="solid"
        mb={0.5}
        cursor="pointer"
        isLoading={uploading}
      >
        Upload NEW
      </Button>

      <Button
        colorScheme="red"
        ml={3}
        // onClick={() => imageUrls.forEach(url => handleDelete(url))}
      >
        Delete All
      </Button>
      <Button
        colorScheme="green"
        ml={3}
        onClick={() => imageUrls.forEach(url => handleShare(url))}
      >
        Share All
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}
      <Text textAlign="left" mb={4}>
        Files Uploaded -
      </Text>
      {imagesLoading && (
        <CircularProgress
          color="gray.600"
          trackColor="blue.300"
          size={7}
          thickness={10}
          isIndeterminate
        />
      )}
      {fetchError && <ErrorText textAlign="left">No Files Found</ErrorText>}
      {!fetchError && imageUrls?.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No Files Found
        </Text>
      )}
      <Box mt={6} align="center">
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {imageUrls?.length > 0 &&
            imageUrls.map(url => (
              <Box
                key={url}
                p={2}
                borderWidth="1px"
                borderColor="gray.200"
                display="flex"
                flexDirection="column" // Align items vertically
              >
                <Text fontSize="md" my={2}>
                  FileName - {}
                </Text>

                {/* Flex container for buttons */}
                <Box
                  display="flex"
                  justifyContent="space-between" // Align buttons evenly
                  width="100%"
                  mt={2} // Add margin between text and buttons
                >
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={() => window.open(url, '_blank')}
                  >
                    Preview
                  </Button>

                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => handleShare(url)}
                  >
                    Share
                  </Button>

                  <Button
                    size="xs"
                    colorScheme="red"
                    // Uncomment if you implement delete functionality
                    // onClick={() => handleDelete(item.presignedUrl)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Posts;
