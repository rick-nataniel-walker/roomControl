<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import MainTable from "@/components/tables/MainTable.vue";
import TextBadge from "@/components/shared/TextBadge.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "RoomsView",
  components: { FontAwesomeIcon, TextBadge, MainTable, FormGroup, ContentWrapper, ActionBtn },
};
</script>

<template>
  <ContentWrapper title="Quartos">
    <template #header>
      <ActionBtn text="Novo Quarto" icon="plus" />
    </template>
    <template #body>
      <div class="flex justify-between">
        <div>
          <FormGroup
            label=""
            placeholder="Pesquisar um quarto..."
            icon="magnifying-glass"
          />
        </div>
        <div>
          <FormGroup
            label=""
            input-type="select"
            placeholder="Breve resumo do artigo..."
          >
            <option value="valor 1" selected>Valor 1</option>
            <option value="valor 1">Valor 3</option>
            <option value="valor 1">Valor 4</option>
          </FormGroup>
        </div>
      </div>

      <MainTable>
        <template #headers>
          <th class="p-4">codigo</th>
          <th class="p-4">Designição</th>
          <th class="p-4">Estado</th>
          <th class="p-4">Remanescente</th>
          <th class="p-4">Acções</th>
        </template>
        <template #body>
          <tr class="my-2 border-b border-gray-200">
            <td class="p-4">1</td>
            <td class="p-4">Room 1</td>
            <td class="p-4">
              <TextBadge type="success" value="Desecupado" />
            </td>
            <td class="p-4">0h:00min</td>
            <td class="p-4">
              <FontAwesomeIcon icon="pen-to-square" />
            </td>
          </tr>
          <tr class="my-1 border-b border-gray-200">
            <td class="p-4">2</td>
            <td class="p-4">Room 2</td>
            <td class="p-4">
              <TextBadge type="warning" value="Ocupado" />
            </td>
            <td class="p-4">1h:30min</td>
          </tr>
        </template>
      </MainTable>
    </template>
  </ContentWrapper>
</template>

<style scoped></style>
