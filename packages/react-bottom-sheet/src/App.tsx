import { useRef } from 'react';
import BottomSheet, { BottomSheetRef } from './BottomSheet';
import './index.css';

const text = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu
    facilisis sed odio morbi quis. Bibendum at varius vel pharetra
    vel turpis nunc eget lorem. Pellentesque adipiscing commodo elit
    at imperdiet. Orci ac auctor augue mauris augue. Quis blandit
    turpis cursus in hac habitasse platea. At volutpat diam ut
    venenatis tellus in metus vulputate eu. Blandit turpis cursus in
    hac. Libero id faucibus nisl tincidunt eget nullam non. In
    fermentum et sollicitudin ac orci. Morbi quis commodo odio
    aenean sed adipiscing. Vitae auctor eu augue ut lectus arcu
    bibendum. Vitae turpis massa sed elementum tempus egestas sed
    sed. Nisl nunc mi ipsum faucibus vitae. Lorem ipsum dolor sit
    amet consectetur. Adipiscing bibendum est ultricies integer quis
    auctor elit. Vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque. Sapien faucibus et molestie ac feugiat sed. Viverra
    vitae congue eu consequat ac felis. Aliquam etiam erat velit
    scelerisque in dictum non. Turpis egestas sed tempus urna et. Et
    magnis dis parturient montes nascetur ridiculus mus mauris. Eu
    volutpat odio facilisis mauris sit amet massa vitae tortor. Eget
    magna fermentum iaculis eu non diam phasellus vestibulum lorem.
    Ut consequat semper viverra nam libero justo laoreet sit.
    Facilisi etiam dignissim diam quis enim lobortis scelerisque
    fermentum dui. Enim nec dui nunc mattis enim. Lobortis elementum
    nibh tellus molestie nunc. Faucibus interdum posuere lorem
    ipsum. Aliquam sem et tortor consequat id porta. Elit
    ullamcorper dignissim cras tincidunt lobortis feugiat vivamus
    at. Risus sed vulputate odio ut. Nascetur ridiculus mus mauris
    vitae ultricies leo integer malesuada. Habitant morbi tristique
    senectus et netus. Sed lectus vestibulum mattis ullamcorper.
    Mauris augue neque gravida in. Tincidunt vitae semper quis
    lectus nulla at volutpat. Consequat ac felis donec et odio
    pellentesque. Ac ut consequat semper viverra nam libero justo
    laoreet sit. Gravida cum sociis natoque penatibus et magnis.
    Neque laoreet suspendisse interdum consectetur libero id. Ac
    turpis egestas maecenas pharetra convallis posuere. Ultrices
    neque ornare aenean euismod elementum nisi quis eleifend quam.
    Non odio euismod lacinia at. Integer malesuada nunc vel risus.
    In hac habitasse platea dictumst vestibulum rhoncus. Vel quam
    elementum pulvinar etiam. Fermentum odio eu feugiat pretium nibh
    ipsum. Magna fermentum iaculis eu non diam phasellus. Vel risus
    commodo viverra maecenas accumsan. Libero enim sed faucibus
    turpis in eu mi bibendum neque. Egestas sed sed risus pretium
    quam vulputate dignissim suspendisse. Vitae sapien pellentesque
    habitant morbi tristique senectus. Blandit cursus risus at
    ultrices. Facilisi morbi tempus iaculis urna. Mauris ultrices
    eros in cursus turpis. Vel quam elementum pulvinar etiam non
    quam. Tellus rutrum tellus pellentesque eu tincidunt tortor.
    Nunc sed velit dignissim sodales ut eu sem integer. Enim diam
    vulputate ut pharetra. Pretium fusce id velit ut tortor pretium
    viverra suspendisse. Vulputate mi sit amet mauris commodo quis
    imperdiet massa tincidunt. Elit ut aliquam purus sit amet luctus
    venenatis lectus magna. Ligula ullamcorper malesuada proin
    libero. Nunc eget lorem dolor sed viverra. Gravida quis blandit
    turpis cursus. Volutpat sed cras ornare arcu dui vivamus arcu
    felis bibendum. Cursus risus at ultrices mi tempus. Sed
    ullamcorper morbi tincidunt ornare massa eget.`,
];

function App() {
    const sheetRef = useRef<BottomSheetRef | null>(null);

    return (
        <div className="flex h-screen items-center justify-center">
            <button
                className="block rounded bg-blue-500 px-3 py-2 text-white drop-shadow-md"
                onClick={() => sheetRef.current?.open()}
            >
                Open Sheet
            </button>
            <BottomSheet ref={sheetRef} grabberVisible>
                <div
                    id="header"
                    className="sticky inset-x-0 top-0 flex items-baseline justify-between bg-white/90 px-4"
                >
                    <button
                        onClick={() => sheetRef.current?.collapse()}
                        className="text-blue-500"
                    >
                        Collapse
                    </button>
                    <h1 className="mb-2 text-xl font-bold">Bottom Sheet</h1>
                    <button
                        onClick={() => sheetRef.current?.expand()}
                        className="text-blue-500"
                    >
                        Expand
                    </button>
                </div>
                <div id="content" className="px-4">
                    <p>{text}</p>
                </div>
            </BottomSheet>
        </div>
    );
}

export default App;
