import { mount } from "@vue/test-utils";
import MainTable from "@/components/tables/MainTable.vue";

describe("MainTable", () => {
  it("renders header and body slots in the correct table sections", () => {
    const wrapper = mount(MainTable, {
      slots: {
        headers: "<th>Quarto</th><th>Estado</th>",
        body: "<tr><td>Room 1</td><td>Disponível</td></tr>",
      },
    });

    expect(wrapper.get("thead").text()).toContain("Quarto");
    expect(wrapper.get("tbody").text()).toContain("Room 1");
    expect(wrapper.findAll("th")).toHaveLength(2);
    expect(wrapper.findAll("td")).toHaveLength(2);
  });

  it("renders optional footer content outside the scroll area", () => {
    const wrapper = mount(MainTable, {
      slots: {
        footer: '<div class="pagination">Pagination</div>',
      },
    });

    expect(wrapper.get(".main-table-shell > .pagination").text()).toBe(
      "Pagination"
    );
  });
});
