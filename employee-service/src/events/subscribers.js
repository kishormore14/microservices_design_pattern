const { subscribeToEvent } = require("./eventBus");
const Employee = require("../models/Employee");

async function setupSubscribers() {
  // When a user is created, we log it (actual employee creation is a separate step
  // triggered by HR via the API, since not every user is an employee immediately)
  await subscribeToEvent(
    "hrms.user",
    "user.deactivated",
    "employee-service.user.deactivated",
    async (data) => {
      console.log(`[EmployeeService] User deactivated event received for userId: ${data.userId}`);
      const employee = await Employee.findOne({ where: { userId: data.userId } });
      if (employee && employee.status !== "terminated") {
        await employee.update({
          status: "terminated",
          dateOfTermination: new Date().toISOString().split("T")[0],
        });
        console.log(`[EmployeeService] Auto-terminated employee ${employee.id} due to user deactivation`);
      }
    }
  );
}

module.exports = { setupSubscribers };
