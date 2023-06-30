// https://github.com/wldyslw/react-bottom-sheet/issues/4
import { type Ref } from 'react';
import BottomSheet, {
    type BottomSheetRef,
    type BottomSheetProps,
} from '@wldyslw/react-bottom-sheet';
import '@wldyslw/react-bottom-sheet/lib/style.css';

const BottomSheetWrapper = ({
    sheetRef,
    ...props
}: BottomSheetProps & { sheetRef?: Ref<BottomSheetRef> }) => {
    return <BottomSheet {...props} ref={sheetRef} />;
};

export default BottomSheetWrapper;
