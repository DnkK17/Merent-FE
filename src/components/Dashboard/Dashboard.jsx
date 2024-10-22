import React from 'react';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import logoPage from "../HomePage/images/logoPage.png";
Chart.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
        data: [18000, 16000, 12000, 8000, 4000, 8000, 14000, 14000, 12000, 16000, 18000, 19000],
      },
    ],
  };

  return (


      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="stat">
            <h3>KHÁCH HÀNG</h3>
            <p>$24k</p>
            <span>↑ 12% Since last month</span>
          </div>
          <div className="stat">
            <h3>TỔNG HÀNG HÓA</h3>
            <p>1.6k</p>
            <span>↓ 16% Since last month</span>
          </div>
          <div className="stat">
            <h3>DỊCH VỤ</h3>
            <p>75.5%</p>
          </div>
          <div className="stat">
            <h3>DOANH THU</h3>
            <p>$15k</p>
          </div>
        </div>

        <div className="dashboard-content-main">
          <div className="sales-chart">
            <h4>Sales</h4>
            <Bar data={salesData} />
          </div>

          <div className="traffic-source">
            <h4>Traffic Source</h4>
            <div className="traffic-pie-chart">
              <div className="desktop">Desktop 63%</div>
              <div className="tablet">Tablet 15%</div>
              <div className="phone">Phone 22%</div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Dashboard;
