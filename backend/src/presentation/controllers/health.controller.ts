export class health_controller {
  health = () => {
    return {
      status: 200,
      message: "Server Running",
    };
  };
}
