
function run_inventory_management_sim() {

  var demand_impact = 0.1
  var allocation_impact = 0.1
  var clearance_impact = 0.25

  var capacities = [90,90,90,90,90]
  var demand = [4,4,4,4,4]
  var purchase = 0
  var allocation = [5,5,5,5,5]
  var clearance = [0,0,0,0,0]
  var clearance_countdown = [0,0,0,0,0]

  d3.timer(function(t){

    // *** SIMULATION ***

    for (var i=0; i<5; i++) {

      // demand
      demand[i] += -0.4 + Math.random() * 0.8
      demand[i] = Math.min(5, Math.max(0, Math.min(capacities[i] / demand_impact, demand[i])))

      // clearance
      // (made slightly complicated by a discrete trigger followed by a constant action period)
      if (clearance_countdown[i] == 0 && (Math.random() < 0.01 && capacities[i] > 10)) {
        clearance_countdown[i] = 30
      } else {
        clearance_countdown[i] = Math.max(0, clearance_countdown[i] - 1)
      }
      if (clearance_countdown[i] > 0) {
        clearance[i] = 1
      } else {
        clearance[i] = 0
      }

      // allocation
      if (capacities[i] > 90) { allocation[i] = 0 }
      else if (capacities[i] < 20) { allocation[i] = 8 }
      else {
        allocation[i] += (-1 + (capacities[i] < 70 ) * 2) * Math.random() * 0.2
        allocation[i] = Math.max(0, allocation[i])
      }

      // capacities
      var d_cap = 0
      d_cap -= demand[i] * demand_impact
      d_cap -= clearance[i] * clearance_impact
      d_cap += allocation[i] * allocation_impact
      capacities[i] = capacities[i] + d_cap

    }

    // purchase
    purchase = d3.sum(allocation)


    // *** SVG ANIMATION ***

    d3.select("#im-capacities").selectAll("rect").data(capacities)
      .attr("height", function(d){ return d })
      .attr("y", function(d){ return (377 - d) })

    d3.select("#im-purchase").selectAll("line").data([purchase])
      .attr("stroke-width", function(d){ return 1 + Math.min(8, d / 2) })

    d3.select("#im-allocation").selectAll("line").data(allocation)
      .attr("stroke-width", function(d){ return 1 + d })

    d3.select("#im-clearance").selectAll("polyline").data(clearance)
      .attr("stroke-width", function(d){ return d * 3 })

    d3.selectAll(".im-demand-return").data(demand)
      .attr("stroke-width", function(d){ return 1 + d })

    d3.selectAll(".im-demand-supply").data(demand)
      .attr("stroke-width", function(d){ return 1 + d * 1.5 })

  })

}
