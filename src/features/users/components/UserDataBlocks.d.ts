import { UserData } from '../hooks/useFetchUserData';
interface UserDataBlocksProps {
    data: UserData;
    viewContent: (id: string) => Promise<void>;
    viewThread: (thread_id: string) => Promise<void>;
}
export default function UserDataBlocks({ data, viewContent, viewThread }: UserDataBlocksProps): any;
export {};
