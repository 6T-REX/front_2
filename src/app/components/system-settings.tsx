import { useEffect, useState } from 'react';
import { Users, UserCog, Shield, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
interface User {
  id: string;
  userId: string; // 로그인 아이디
  name: string;
  role: '관리자' | '개발자';
  email: string;
  registrationDate: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: 'U000',
    userId: 'user0',
    name: '김가네',
    role: '관리자',
    email: 'kim.gangne@neuraleye.kr',
    registrationDate: '2025-01-01',
    lastLogin: '2026-02-11 15:00:00',
  },
  {
    id: 'U001',
    userId: 'user1',
    name: '김민준',
    role: '관리자',
    email: 'kim.minjun@neuraleye.kr',
    registrationDate: '2025-01-15',
    lastLogin: '2026-02-11 14:23:45',
  },
  {
    id: 'U002',
    userId: 'user2',
    name: '이서연',
    role: '관리자',
    email: 'lee.seoyeon@neuraleye.kr',
    registrationDate: '2025-02-20',
    lastLogin: '2026-02-11 13:45:22',
  },
  {
    id: 'U003',
    userId: 'user3',
    name: '박지훈',
    role: '관리자',
    email: 'park.jihoon@neuraleye.kr',
    registrationDate: '2025-03-10',
    lastLogin: '2026-02-11 10:15:33',
  },
  {
    id: 'U004',
    userId: 'user4',
    name: '정수빈',
    role: '관리자',
    email: 'jung.subin@neuraleye.kr',
    registrationDate: '2025-04-05',
    lastLogin: '2026-02-10 18:22:11',
  },
  {
    id: 'U005',
    userId: 'user5',
    name: '최도윤',
    role: '관리자',
    email: 'choi.doyun@neuraleye.kr',
    registrationDate: '2025-05-18',
    lastLogin: '2026-02-11 09:34:56',
  },
  {
    id: 'U006',
    userId: 'user6',
    name: '한지민',
    role: '관리자',
    email: 'han.jimin@neuraleye.kr',
    registrationDate: '2025-06-03',
    lastLogin: '2026-02-11 08:41:19',
  },
  {
    id: 'U007',
    userId: 'user7',
    name: '윤태호',
    role: '관리자',
    email: 'yoon.taeho@neuraleye.kr',
    registrationDate: '2025-06-21',
    lastLogin: '2026-02-10 20:17:08',
  },
  {
    id: 'U008',
    userId: 'user8',
    name: '송하은',
    role: '관리자',
    email: 'song.haeun@neuraleye.kr',
    registrationDate: '2025-07-11',
    lastLogin: '2026-02-11 11:02:44',
  },
  {
    id: 'D000',
    userId: 'admin0',
    name: '김인경',
    role: '개발자',
    email: 'kim.ingyeong@neuraleye.kr',
    registrationDate: '2024-12-01',
    lastLogin: '2026-02-11 15:30:00',
  },
  {
    id: 'D001',
    userId: 'admin1',
    name: '강창우',
    role: '개발자',
    email: 'kang.changwoo@neuraleye.kr',
    registrationDate: '2024-12-01',
    lastLogin: '2026-02-11 15:25:00',
  },
  {
    id: 'D002',
    userId: 'admin2',
    name: '박승수',
    role: '개발자',
    email: 'park.seungsu@neuraleye.kr',
    registrationDate: '2024-12-01',
    lastLogin: '2026-02-11 15:20:00',
  },
];

interface SystemSettingsProps {
  userRole: 'user' | 'admin';
  userName: string;
}

export function SystemSettings({ userRole, userName }: SystemSettingsProps) {
  const USERS_PER_PAGE = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuUserId, setOpenActionMenuUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userRole === 'admin' ? 'admin@neuraleye.kr' : 'user@neuraleye.kr',
    phone: '+82 10-1234-5678',
    department: userRole === 'admin' ? '개발팀' : '운영팀',
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: '관리자' | '개발자') => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
  const displayStart = filteredUsers.length === 0 ? 0 : (currentPage - 1) * USERS_PER_PAGE + 1;
  const displayEnd = Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length);

  const openEditDialog = (targetUser: User) => {
    setEditingUser(targetUser);
    setEditName(targetUser.name);
    setEditEmail(targetUser.email);
  };

  const handleUserEditSave = () => {
    if (!editingUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: editName.trim() || user.name,
              email: editEmail.trim() || user.email,
            }
          : user
      )
    );
    setEditingUser(null);
  };

  const openDeleteDialog = (targetUser: User) => {
    setDeletingUser(targetUser);
  };

  const handleUserDeleteConfirm = () => {
    if (!deletingUser) return;
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletingUser.id));
    setDeletingUser(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-action-menu="true"]')) {
        setOpenActionMenuUserId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-white/10 bg-[#0B1019]/50 backdrop-blur-xl px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">시스템 설정</h1>
          <p className="text-xs text-gray-400 mt-0.5">사용자 관리 및 권한 설정</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue={userRole === 'admin' ? "users" : "profile"} className="h-full flex flex-col">
          <TabsList className="w-fit mb-4 bg-white/5 border border-white/10">
            {userRole === 'admin' && (
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-[#00E5FF]/10 data-[state=active]:text-[#00E5FF]"
              >
                <Users className="w-4 h-4 mr-2" />
                사용자 관리
              </TabsTrigger>
            )}
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#00E5FF]/10 data-[state=active]:text-[#00E5FF]"
            >
              <UserCog className="w-4 h-4 mr-2" />
              프로필 설정
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab - Admin only */}
          {userRole === 'admin' && (
            <TabsContent value="users" className="flex-1 overflow-hidden mt-0">
            <div className="h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00E5FF]/5 to-[#10B981]/5 pointer-events-none" />

              <div className="relative flex-1 flex flex-col">
                {/* Search Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="사용자 ID, 이름, 이메일로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#0B1019]/50 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
                      />
                    </div>

                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-40 bg-[#0B1019]/50 border-white/20 text-white">
                        <SelectValue placeholder="역할 필터" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="관리자">관리자</SelectItem>
                        <SelectItem value="개발자">개발자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">전체:</span>
                      <span className="text-white font-semibold">{users.length}명</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">관리자:</span>
                      <span className="text-[#00E5FF] font-semibold">
                        {users.filter((u) => u.role === '관리자').length}명
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">개발자:</span>
                      <span className="text-[#10B981] font-semibold">
                        {users.filter((u) => u.role === '개발자').length}명
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 min-h-0 p-6 flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                  <div className="rounded-lg border border-white/10 bg-[#0B1019]/30 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-gray-400">사용자 ID</TableHead>
                          <TableHead className="text-gray-400">아이디</TableHead>
                          <TableHead className="text-gray-400">이름</TableHead>
                          <TableHead className="text-gray-400">이메일</TableHead>
                          <TableHead className="text-gray-400">역할</TableHead>
                          <TableHead className="text-gray-400">가입일</TableHead>
                          <TableHead className="text-gray-400">최근 접속</TableHead>
                          <TableHead className="text-gray-400 text-right">작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="border-white/10 hover:bg-white/5 transition-colors"
                          >
                            <TableCell className="font-mono text-[#00E5FF] font-medium">
                              {user.id}
                            </TableCell>
                            <TableCell className="font-mono text-cyan-400 font-medium">
                              {user.userId}
                            </TableCell>
                            <TableCell className="text-white font-medium">{user.name}</TableCell>
                            <TableCell className="text-gray-300">{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.role === '관리자'
                                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                                    : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-400 font-mono text-sm">
                              {user.registrationDate}
                            </TableCell>
                            <TableCell className="text-gray-400 font-mono text-sm">
                              {user.lastLogin}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Select
                                  value={user.role}
                                  onValueChange={(value) =>
                                    handleRoleChange(user.id, value as '관리자' | '개발자')
                                  }
                                >
                                  <SelectTrigger className="w-28 h-8 text-xs bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="관리자">관리자</SelectItem>
                                    <SelectItem value="개발자">개발자</SelectItem>
                                  </SelectContent>
                                </Select>

                                <div className="relative" data-user-action-menu="true">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                                    onClick={() =>
                                      setOpenActionMenuUserId((prev) =>
                                        prev === user.id ? null : user.id
                                      )
                                    }
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                  {openActionMenuUserId === user.id && (
                                    <div className="absolute right-0 top-9 z-[100] w-40 rounded-md border border-white/10 bg-[#0B1019] p-1 shadow-lg">
                                      <button
                                        type="button"
                                        className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-gray-300 hover:bg-white/10"
                                        onClick={() => {
                                          openEditDialog(user);
                                          setOpenActionMenuUserId(null);
                                        }}
                                      >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        사용자 수정
                                      </button>
                                      <button
                                        type="button"
                                        className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        onClick={() => {
                                          openDeleteDialog(user);
                                          setOpenActionMenuUserId(null);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        사용자 삭제
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
                    <p className="text-sm text-gray-400">
                      {filteredUsers.length}명 중 {displayStart}-{displayEnd}명 표시
                    </p>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isActive = page === currentPage;
                        return (
                          <Button
                            key={page}
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(page)}
                            className={
                              isActive
                                ? 'h-8 min-w-8 border-[#00E5FF]/40 bg-[#00E5FF]/15 text-[#00E5FF] hover:bg-[#00E5FF]/25'
                                : 'h-8 min-w-8 border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                            }
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          )}

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="flex-1 overflow-hidden mt-0">
            <div className="h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-[#00E5FF]/5 pointer-events-none" />

              <div className="relative h-full overflow-y-auto p-6">
                <div className="max-w-2xl space-y-6">
                  {/* Profile Card */}
                  <div className="p-6 rounded-lg border border-white/10 bg-[#0B1019]/30">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#10B981] flex items-center justify-center flex-shrink-0">
                        <Shield className="w-10 h-10 text-[#0B1019]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{profileData.name}</h3>
                        <p className="text-sm text-[#00E5FF] mb-2">{userRole === 'admin' ? '개발자' : '관리자(실사용자)'}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                          프로필 사진 변경
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="p-6 rounded-lg border border-white/10 bg-[#0B1019]/30 space-y-4">
                    <h3 className="text-white font-semibold mb-4">개인 정보</h3>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        이름
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="bg-[#0B1019]/50 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        이메일
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="bg-[#0B1019]/50 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        연락처
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="bg-[#0B1019]/50 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-300">
                        부서
                      </Label>
                      <Input
                        id="department"
                        type="text"
                        value={profileData.department}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, department: e.target.value }))
                        }
                        className="bg-[#0B1019]/50 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      취소
                    </Button>
                    <Button className="bg-gradient-to-r from-[#00E5FF] to-[#10B981] hover:from-[#00E5FF]/90 hover:to-[#10B981]/90 text-[#0B1019] font-semibold">
                      저장하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-[#0B1019] border-white/15 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">사용자 수정</DialogTitle>
            <DialogDescription className="text-gray-400">
              사용자 이름과 이메일을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name" className="text-gray-300">
                이름
              </Label>
              <Input
                id="edit-user-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[#0B1019]/70 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-email" className="text-gray-300">
                이메일
              </Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-[#0B1019]/70 border-white/20 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              취소
            </Button>
            <Button
              onClick={handleUserEditSave}
              className="bg-gradient-to-r from-[#00E5FF] to-[#10B981] hover:from-[#00E5FF]/90 hover:to-[#10B981]/90 text-[#0B1019] font-semibold"
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent className="bg-[#0B1019] border-white/15 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">사용자 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {deletingUser
                ? `${deletingUser.name} (${deletingUser.userId}) 사용자를 삭제하시겠습니까?`
                : '선택된 사용자를 삭제하시겠습니까?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUserDeleteConfirm}
              className="bg-red-500/85 text-white hover:bg-red-500"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
