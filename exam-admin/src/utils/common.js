export function logout() {
    this.$alert("登录状态过期，请重新登录", "提示", {
        confirmButtonText: "确定",
        callback: action => {
            this.$message({
                type: "error",
                message: `请重新登录`
            });
        }
    });
    localStorage.removeItem("user_token");
    ocalStorage.removeItem("user_role");
    this.$router.push("/login");
}