import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react';
import {
  CheckCircle2,
  DownloadIcon,
  ExternalLinkIcon,
  PlayCircle,
  Timer,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { CheckResultEnum, CheckStatusEnum, CheckTypeEnum } from '../constants';
import { CheckInterface, Company, Individual } from '../types';

type CheckItemProps = {
  entity: Company | Individual | null;
  check: CheckInterface;
  selectCheck: (check: CheckInterface) => void;
  setCurrentEntity: Dispatch<SetStateAction<Company | Individual | null>>;
  onOpen: () => void;
};

const CheckItem = (props: CheckItemProps) => {
  const { check, selectCheck, setCurrentEntity, entity, onOpen } = props;
  const { t } = useTranslation();

  const exactType = (currentCheck: CheckInterface) => {
    return currentCheck.type === CheckTypeEnum.document && currentCheck.subtype
      ? currentCheck.subtype.split(':')[1]
      : currentCheck.type;
  };

  // @NOTE Add a fallback title when a custom document type created after the onboarding flow init
  const checkTitleFallBack = useMemo(() => {
    if (
      check.type === CheckTypeEnum.document &&
      check.data.settings.custom_document_type
    ) {
      return check.data.settings.custom_document_type.label;
    }
    // eslint-disable-next-line
  }, [check.type]);

  return (
    <Box px="4" py="6" width="100%">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'stretch', md: 'center' }}
      >
        <Box>
          <Heading size="sm">
            {t(
              `checks.${exactType(check)}.title`,
              checkTitleFallBack as string
            )}
          </Heading>
        </Box>

        <Spacer />

        <Box>
          {check.status === CheckStatusEnum.rejected && (
            <Tag
              mr={{ base: 0, md: 5 }}
              mt={{ base: 3, md: 0 }}
              colorScheme="red"
            >
              <Box as="span" mr="2">
                <XCircle size={16} />
              </Box>
              {t('domain.check.status.rejected')}
            </Tag>
          )}
          {check.status === CheckStatusEnum.approved && (
            <Tag
              mr={{ base: 0, md: 5 }}
              mt={{ base: 3, md: 0 }}
              colorScheme="green"
            >
              <Box as="span" mr="2">
                <CheckCircle2 size={16} />
              </Box>
              {t('domain.check.status.approved')}
            </Tag>
          )}
          {(check.status === CheckStatusEnum.need_review ||
            check.status === CheckStatusEnum.processing) && (
            <Tag
              mr={{ base: 0, md: 5 }}
              mt={{ base: 3, md: 0 }}
              colorScheme="blue"
            >
              <Box as="span" mr="2">
                <PlayCircle size={16} />
              </Box>
              {t('domain.check.status.need_review')}
            </Tag>
          )}
          {check.status === CheckStatusEnum.expired && (
            <Tag
              mr={{ base: 0, md: 5 }}
              mt={{ base: 3, md: 0 }}
              colorScheme="yellow"
            >
              <Box as="span" mr="2">
                <Timer size={16} />
              </Box>
              {t('domain.check.status.expired')}
            </Tag>
          )}
        </Box>

        <>
          {[
            CheckStatusEnum.expired,
            CheckStatusEnum.rejected,
            CheckStatusEnum.in_progress,
          ].includes(check.status) && (
            <>
              {check.type === CheckTypeEnum.id_verification ? (
                <Button
                  as={Link}
                  variant="outline"
                  href={check.data.vendor.verification_url}
                  leftIcon={<ExternalLinkIcon size={16} />}
                  width={['100%', 'auto', 'auto']}
                  isDisabled={
                    check.status !== CheckStatusEnum.in_progress &&
                    check.data.result !== CheckResultEnum.rejected
                  }
                  mt={{ base: '12px', md: '0' }}
                  isExternal
                >
                  {t('verify_identity')}
                </Button>
              ) : (
                <Button
                  leftIcon={<DownloadIcon size={16} />}
                  width={['100%', 'auto', 'auto']}
                  id={check.id}
                  name={check.type}
                  variant="outline"
                  onClick={() => {
                    selectCheck(check);
                    setCurrentEntity(entity);
                    onOpen();
                  }}
                  mt={{ base: '12px', md: '0' }}
                >
                  {t('upload_document')}
                </Button>
              )}
            </>
          )}
        </>
      </Flex>
      {check.status === 'rejected' && (
        <Text color="red.600" mt={{ base: '12px', md: '0' }}>
          {check.data.review.comment}
        </Text>
      )}
    </Box>
  );
};

export default CheckItem;
