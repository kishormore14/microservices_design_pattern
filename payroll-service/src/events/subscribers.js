const { subscribeToEvent } = require("./eventBus");

async function setupSubscribers() {
  // When an employee is terminated, log it for final settlement awareness
  await subscribeToEvent(
    "hrms.employee",
    "employee.terminated",
    "payroll-service.employee.terminated",
    async (data) => {
      console.log(
        `[PayrollService] Employee terminated event received for employeeId: ${data.employeeId}. ` +
        `Final settlement should be initiated.`
      );
      // In a real system, this would trigger a final settlement calculation
    }
  );
}

module.exports = { setupSubscribers };
