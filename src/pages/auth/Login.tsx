import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp, getCurrentUser } from "@/lib/auth"; // Giả định signIn/signUp chỉ cần email/password
import { Loader2 } from "lucide-react"; 

// --- Custom Constants ---
const APP_NAME = "MSC Center - HRM AI";
const LOGO_PATH = "/LOGO.PNG"; // Đường dẫn đến logo tổ chức

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // --- State cho Đăng nhập ---
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // --- State cho Đăng ký (Đã được Tách riêng) ---
    const [signupFirstName, setSignupFirstName] = useState("");
    const [signupLastName, setSignupLastName] = useState("");
    // Đã tách riêng state cho Email và Phone Number
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPhoneNumber, setSignupPhoneNumber] = useState(""); 
    const [signupPassword, setSignupPassword] = useState("");

    // --- Logic: Kiểm tra Auth và Redirect ---
    useEffect(() => {
        const checkUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                navigate("/dashboard");
            }
        };
        checkUser();
    }, [navigate]);

    // --- Xử lý Đăng nhập ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Giả định hàm signIn nhận email và password
            const { error } = await signIn(loginEmail, loginPassword);
            
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Đăng nhập Thất bại",
                    description: error.message
                });
                return;
            }

            toast({
                title: "Chào mừng trở lại!",
                description: "Đăng nhập thành công, đang kiểm tra quyền..."
            });
            navigate("/dashboard"); 
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Lỗi Hệ thống",
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Xử lý Đăng ký ---
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Giả định hàm signUp nhận email, password và object data bổ sung
        try {
            const { error } = await signUp(signupEmail, signupPassword, {
                full_name: `${signupFirstName} ${signupLastName}`,
                phone_number: signupPhoneNumber // Thêm phone_number vào data bổ sung
            });
            
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Đăng ký Thất bại",
                    description: error.message
                });
                return;
            }

            toast({
                title: "Tạo tài khoản Thành công!",
                description: "Tài khoản của bạn đã được tạo và đang chờ phê duyệt từ Admin."
            });
            // Giữ nguyên ở trang này sau khi đăng ký thành công
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Lỗi Hệ thống",
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-lg animate-fade-in">
                
                {/* --- HEADER/LOGO --- */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <img 
                            src={LOGO_PATH} 
                            alt="Logo Tổ chức" 
                            className="w-16 h-16 rounded-xl shadow-xl shadow-primary/30 object-contain"
                        />
                        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground">
                            {APP_NAME}
                        </h1>
                    </div>
                </div>

                {/* --- LOGIN/SIGNUP CARD --- */}
                <Card className="shadow-2xl border-2 border-border/70 transform hover:shadow-primary/20 transition-all duration-300">
                    <Tabs defaultValue="login" className="w-full">
                        
                        {/* Tab Headers */}
                        <CardHeader className="pt-6 pb-0">
                            <TabsList className="grid w-full grid-cols-2 h-12 text-lg">
                                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                                <TabsTrigger value="signup">Đăng ký</TabsTrigger> 
                            </TabsList>
                        </CardHeader>

                        {/* --- TAB CONTENT: ĐĂNG NHẬP --- */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-6 pt-6">
                                    <CardTitle className="text-2xl text-center">Chúc một ngày làm việc năng suất</CardTitle>
                                
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email">Email</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="Nhập email của bạn" // Đã thêm placeholder
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="login-password">Mật khẩu</Label>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="********" // Đã thêm placeholder
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                            {/* Link Quên mật khẩu */}
                                            <p className="text-sm text-right text-primary hover:underline cursor-pointer pt-1" onClick={() => navigate("/auth/forgot-password")}>
                                                Quên mật khẩu?
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <CardFooter>
                                    <Button type="submit" className="w-full h-10 text-base gradient-primary shadow-lg shadow-primary/30" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            "Đăng nhập"
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>

                        {/* --- TAB CONTENT: ĐĂNG KÝ (Đã sửa lỗi lặp trường thông tin) --- */}
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup}>
                                <CardContent className="space-y-6 pt-6">
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-firstname">Họ</Label>
                                            <Input
                                                id="signup-firstname"
                                                type="text"
                                                placeholder="Ví dụ: Nguyễn"
                                                value={signupFirstName}
                                                onChange={(e) => setSignupFirstName(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        {/* Last Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-lastname">Tên</Label>
                                            <Input
                                                id="signup-lastname"
                                                type="text"
                                                placeholder="Ví dụ: Văn A"
                                                value={signupLastName}
                                                onChange={(e) => setSignupLastName(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* SỐ ĐIỆN THOẠI - ĐÃ DÙNG STATE VÀ ID RIÊNG */}
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-phone">Số điện thoại</Label>
                                        <Input
                                            id="signup-phone"
                                            type="tel" // Thay type="number" bằng type="tel" cho số điện thoại
                                            placeholder="09xx xxx xxx"
                                            value={signupPhoneNumber}
                                            onChange={(e) => setSignupPhoneNumber(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    {/* EMAIL - ĐÃ DÙNG STATE VÀ ID RIÊNG */}
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email-field">Email</Label>
                                        <Input
                                            id="signup-email-field" // ID đã được đổi
                                            type="email"
                                            placeholder="email@congty.com"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Mật khẩu</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="********"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            minLength={6}
                                        />
                                        <p className="text-xs text-muted-foreground pt-1">Mật khẩu tối thiểu 6 ký tự.</p>
                                    </div>
                                </CardContent>
                                
                                <CardFooter>
                                    <Button type="submit" className="w-full h-10 text-base gradient-primary shadow-lg shadow-primary/30" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang gửi yêu cầu...
                                            </>
                                        ) : (
                                            "Đăng Ký"
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default Login;